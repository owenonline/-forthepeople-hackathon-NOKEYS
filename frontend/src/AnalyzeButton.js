import './AnalyzeButton.css'

export default function AnalyzeButton(props) {
    const handleClick = () => { 
        props.onTransition(props.nextComponent);
    };

    return (
        <div className="analyze_button_container">
            <button className="analyze_button" onClick={handleClick}>Analyze</button>
        </div>
    );
}