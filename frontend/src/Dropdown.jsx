import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import classNames from 'classnames';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import './Dropdown.css';


const AccordionDemo = () => (
  <Accordion.Root className="AccordionRoot" type="single" defaultValue="item-1" collapsible>
    <Accordion.Item className="AccordionItem" value="item-1">
      <AccordionTrigger>Deposition Summary</AccordionTrigger>
      <AccordionContent>                The deposition took place on April 15, 2023, and Mr. Smith was the first to be deposed. During the deposition, Mr. Smith testified that he has owned his property for over 10 years and has always believed that the strip of land in question was his. He claimed that Mr. Johnson's fence and trees were well over the boundary line and that they had caused damage to his property.
 
 Mr. Johnson was deposed next, and he disputed Mr. Smith's claims. He stated that he had obtained a survey of the property when he bought his house five years ago, which clearly showed that the strip of land belonged to him. He also provided documents showing that he had obtained the necessary permits from the city to build the fence and plant the trees.

   Both parties were represented by attorneys during the deposition, who asked questions to clarify the testimony and ensure that the record was accurate. The deposition was recorded by a court reporter and will be used as evidence if the case goes to trial.</AccordionContent>
    </Accordion.Item>

    <Accordion.Item className="AccordionItem" value="item-2">
      <AccordionTrigger>Medical Record Summary</AccordionTrigger>
      <AccordionContent>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
      </AccordionContent>
    </Accordion.Item>

    <Accordion.Item className="AccordionItem" value="item-3">
      <AccordionTrigger>Police Report Summary</AccordionTrigger>
      <Accordion.Content className="AccordionContent">
        <div className="AccordionContentText">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed dolorum, debitis minus nulla iusto sequi rerum pariatur autem voluptas voluptates, deleniti non tenetur nemo corporis molestias quam consequatur architecto. Mollitia.
        </div>
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
);

const AccordionTrigger = React.forwardRef(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Header className="AccordionHeader">
    <Accordion.Trigger
      className={classNames('AccordionTrigger', className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <ChevronDownIcon className="AccordionChevron" aria-hidden />
    </Accordion.Trigger>
  </Accordion.Header>
));

const AccordionContent = React.forwardRef(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Content
    className={classNames('AccordionContent', className)}
    {...props}
    ref={forwardedRef}
  >
    <div className="AccordionContentText">{children}</div>
  </Accordion.Content>
));

export default AccordionDemo;