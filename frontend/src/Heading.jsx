const Heading = ({ text }) => {
    return (
        <div className="heading-proctor" style={{ 
            padding: "10px", 
            textAlign: "center", 
            backgroundColor: "#000", 
            borderBottom: "solid 0.5px gray",
        }}>
            {text}
        </div>
    )
}

export default Heading