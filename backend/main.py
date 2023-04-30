from flask import Flask, request, make_response, jsonify
import os
from langchain.chat_models import ChatOpenAI
from langchain.schema import (
    SystemMessage,
    HumanMessage
)
import pytesseract
from PIL import Image
from pdf2image import convert_from_bytes, convert_from_path
import numpy as np
import tiktoken
import json
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import TimeoutException
from webdriver_manager.chrome import ChromeDriverManager
import time
import zipfile
import asyncio
from dotenv import load_dotenv

load_dotenv()

# os.environ["OPENAI_API_KEY"] = ""

gpt4_llm = ChatOpenAI(model_name="gpt-4", temperature=0)
encoding = tiktoken.encoding_for_model("gpt-4")

def num_tokens_from_messages(messages):
    num_tokens = 0
    tokens_per_message = 4
    for message in messages:
        num_tokens += tokens_per_message + len(encoding.encode(message.content))
    num_tokens += 3  # every reply is primed with <|start|>assistant<|message|>
    return num_tokens

app = Flask(__name__)

async def summarize_legal_research_worker(filepath):
    doc = convert_from_path(filepath)
    doc_txt = ""
    for page_number, page_data in enumerate(doc):
        doc_txt += pytesseract.image_to_string(Image.fromarray(np.array(page_data))) + "\n"

    messages = [
        SystemMessage(content=f"Below is information regarding a civil law suit. Extract the case name, what happened, what injuries were sustained, who was at fault, and what the settlement was."),
        HumanMessage(content=doc_txt),
    ]

    if num_tokens_from_messages(messages) > 8000:
        response = ""
        while num_tokens_from_messages(messages) > 8000:
            messages = [
                SystemMessage(content=f"Below you will be given a portion of the information regarding a civil law suit. Extract the case name, what happened, what injuries were sustained, who was at fault, and what the settlement was. Don't include any information you already know."),
                SystemMessage(content=f"Here is the information you know so far from reading other information about this case:\n{response}"),
                HumanMessage(content=doc_txt[:12000]),
            ]
            model_resp = await gpt4_llm.agenerate(messages=[messages])
            response += model_resp.generations[0][0].text + "\n"
            doc_txt = doc_txt[12000:]
        return response
    else:
        model_resp = await gpt4_llm.agenerate(messages=[messages])
        return model_resp.generations[0][0].text
    
async def basic_worker(task_prompt, summary_str):
    messages = [
        SystemMessage(content=task_prompt),
        HumanMessage(content=summary_str),
    ]
    model_resp = await gpt4_llm.agenerate(messages=[messages])
    return model_resp.generations[0][0].text

async def summarize_case_docs_worker(filebytes):
    doc = convert_from_bytes(filebytes)
    doc_txt = ""
    for page_number, page_data in enumerate(doc):
        doc_txt += pytesseract.image_to_string(Image.fromarray(np.array(page_data))) + "\n"

    messages = [
        SystemMessage(content=f"Below is a legal document that is part of a civil law suit. Summarize all of the potentially relevant information from it into a bullet point list."),
        HumanMessage(content=doc_txt),
    ]

    if num_tokens_from_messages(messages) > 8000:
        response = ""
        while num_tokens_from_messages(messages) > 8000:
            messages = [
                SystemMessage(content=f"Below you will be given a portion of a legal document that is part of a civil law suit. Summarize all of the potentially relevant information from it into a bullet point list. Don't include any information from previous portions of the document."),
                SystemMessage(content=f"Here is the information you know so far from reading previous portions of the document:\n{response}"),
                HumanMessage(content=doc_txt[:12000]),
            ]
            model_resp = await gpt4_llm.agenerate(messages=[messages])
            response += model_resp.generations[0][0].text + "\n"
            doc_txt = doc_txt[12000:]
        return response
    else:
        model_resp = await gpt4_llm.agenerate(messages=[messages])
        return model_resp.generations[0][0].text

@app.route('/upload', methods=['POST'])
async def process():
    print("Starting processing")
    # process and summarize case docs asynchronously
    file_names = list(request.files.keys())
    tasks = []
    for file_name in file_names:
        task = asyncio.create_task(summarize_case_docs_worker(request.files[file_name].read()))
        tasks.append(task)
    summaries = await asyncio.gather(*tasks)
    response = jsonify(dict(zip(file_names, summaries)))

    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/research', methods=['POST'])
async def research():
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)
    elif request.method == 'POST':
        summary_str = request.data.decode('utf-8')#str(request.json)

        print(summary_str)
        print("beginning tasks")

        # conduct initial analysis of case docs
        tasks = []
        task_prompts = ["Below is a summary of the legal documents submitted as part of a civil law suit. Point out any and all inconsistent information between documents.",
                        f"Below is a summary of the legal documents submitted as part of a civil law suit. Suggest the top 5 additional documents that would strengthen the defendant's case and give a sentence explaining why.",
                        f"Below is a summary of the legal documents submitted as part of a civil law suit. Give 4 keywords related to this case on a single line."]
        for task_prompt in task_prompts:
            task = asyncio.create_task(basic_worker(task_prompt, summary_str))
            tasks.append(task)
        responses = await asyncio.gather(*tasks)
        inconsistencies, addtl_docs, search_term = responses
        search_term = search_term.replace(",", '')

        print("completed tasks")

        # conduct additional legal research
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        driver.maximize_window()

        # navigate to login page and sign in
        driver.get("https://westlaw.com/")
        timeout = 15
        try:
            element_present = EC.presence_of_element_located((By.CSS_SELECTOR, '#Username'))
            WebDriverWait(driver, timeout).until(element_present)
        except TimeoutException:
            print("Timed out waiting for page to load")
        driver.find_element(By.CSS_SELECTOR, '#Username').send_keys(os.environ["WESTLAW_LOGIN"])
        time.sleep(3)
        driver.find_element(By.CSS_SELECTOR, '#Password').send_keys(os.environ["WESTLAW_PASSWORD"])
        driver.find_element(By.CSS_SELECTOR, '#SignIn').click()

        # wait for session page to load, start new session and reload page
        time.sleep(10)
        driver.find_element(By.XPATH, "/html/body/div[2]/div/div[1]/div/div/div/div/div[2]/div/div/div[1]/h3").click()
        driver.find_element(By.CSS_SELECTOR, '#co_clientIDContinueButton').click()
        time.sleep(5)
        driver.refresh()

        # wait for main page to load, then enter the search term
        try:
            element_present = EC.presence_of_element_located((By.CSS_SELECTOR, '#searchInputId'))
            WebDriverWait(driver, timeout).until(element_present)
        except TimeoutException:
            print("Timed out waiting for page to load")
        driver.find_element(By.CSS_SELECTOR, '#searchInputId').send_keys(search_term)
        driver.find_element(By.CSS_SELECTOR, '#searchButton').click()

        # wait for search to complete, then switch to jury verdicts view
        try:
            element_present = EC.presence_of_element_located((By.CSS_SELECTOR, '#co_search_contentNav_link_JURYVERDICT'))
            WebDriverWait(driver, timeout).until(element_present)
        except TimeoutException:
            print("Timed out waiting for page to load")
        driver.find_element(By.CSS_SELECTOR, '#co_search_contentNav_link_JURYVERDICT').click()

        # wait for window to switch, then start grabbing documents
        try:
            element_present = EC.presence_of_element_located((By.CSS_SELECTOR, '#co_linkBuilder'))
            WebDriverWait(driver, timeout).until(element_present)
        except TimeoutException:
            print("Timed out waiting for page to load")
        driver.find_element(By.CSS_SELECTOR, '#co_linkBuilder').click()

        # get share link
        try:
            element_present = EC.presence_of_element_located((By.CSS_SELECTOR, '#co_LinkBuilderUrl'))
            WebDriverWait(driver, timeout).until(element_present)
        except TimeoutException:
            print("Timed out waiting for page to load")
        share_link = driver.find_element(By.CSS_SELECTOR, '#co_LinkBuilderUrl').get_attribute('value')
        driver.find_element(By.CSS_SELECTOR, '#co_linkBuilderLightbox_CloseLink').click()

        # prepare to download case files
        try:
            element_present = EC.presence_of_element_located((By.CSS_SELECTOR, '#dropdown_5 > button:nth-child(1) > span'))
            WebDriverWait(driver, timeout).until(element_present)
        except TimeoutException:
            print("Timed out waiting for page to load")
        driver.find_element(By.CSS_SELECTOR, '#dropdown_5 > button:nth-child(1) > span').click()

        # prepare even more
        try:
            element_present = EC.presence_of_element_located((By.CSS_SELECTOR, '#co_deliveryDownloadButton'))
            WebDriverWait(driver, timeout).until(element_present)
            time.sleep(5)
        except TimeoutException:
            print("Timed out waiting for page to load")
        driver.find_element(By.CSS_SELECTOR, '#co_deliveryDownloadButton').click()

        # finally actually download the files
        try:
            element_present = EC.presence_of_element_located((By.CSS_SELECTOR, '#coid_deliveryWaitMessage_downloadButton'))
            WebDriverWait(driver, timeout).until(element_present)
        except TimeoutException:
            print("Timed out waiting for page to load")
        driver.find_element(By.CSS_SELECTOR, '#coid_deliveryWaitMessage_downloadButton').click()

        # wait until the file is finished downloading
        while not os.path.exists("/home/owenb/Downloads/" + f"Westlaw Edge - 20 full text items for {search_term}"[:100] + ".zip"):
            time.sleep(1)

        with zipfile.ZipFile("/home/owenb/Downloads/" + f"Westlaw Edge - 20 full text items for {search_term}"[:100] + ".zip", 'r') as zip_ref:
            os.mkdir("/home/owenb/Downloads/westlaw_files")
            zip_ref.extractall("/home/owenb/Downloads/westlaw_files")

        file_paths = ["/home/owenb/Downloads/westlaw_files/" + file for file in os.listdir("/home/owenb/Downloads/westlaw_files")]
        tasks = []
        for count, file_path in enumerate(file_paths):
            if count >= 5:
                break
            task = asyncio.create_task(summarize_legal_research_worker(file_path))
            tasks.append(task)
        summaries = await asyncio.gather(*tasks)
        summaries = '\n'.join(summaries)

        # replace newlines with brs for new lines
        # summaries = summaries.replace("\n", "<br>")
        # inconsistencies = inconsistencies.replace("\n", "<br>")
        # addtl_docs = addtl_docs.replace("\n", "br")

        print("Finished running successfully, about to return data")
        response = jsonify({"inconsistencies": inconsistencies, "addl_docs": addtl_docs, "similar_cases": (share_link, summaries)})# 
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
            

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=int(os.environ.get('PORT', 8080)))