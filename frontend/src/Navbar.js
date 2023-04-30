import book from './Icons/open-book.png'
import './Navbar.css'

export default function Navbar() {
    return (
        <div className="navbar">
            <div className="navbar_logo_container">
                <img src={book} alt='open-book' className="navbar_logo_pic"></img>
                <p className="navbar_logo_text">LawGPT</p>
            </div>
        </div>
    );
}

