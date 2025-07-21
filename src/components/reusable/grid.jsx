import { Badge, Button, Card } from "react-bootstrap";

const styles = {
    card : {
        width: '25rem', 
        // height: '28rem'
    },

    cardImage: {
        flex: 1,
        height: "auto",
        width: "auto",
        resizeMode: 'contain' 
    },

    button: {
        "background-color": "none"
    }
}

function Grid(props) {
    console.log('Grid component received props:', props);
    console.log('Props list length:', props.list?.length);
    
    if (!props.list || props.list.length === 0) {
        return (
            <div className="text-center text-white">
                <p>No projects to display</p>
            </div>
        );
    }
    
    return (
        <div className="container my-12 mx-auto px-4 md:px-12">
            <div className="flex flex-wrap -mx-1 lg:-mx-4 columns-3 gap-8 justify-center">
                    {props.list.map((link) => (
                        <Card 
                            className="text-center w-full aspect-auto"
                            bg={link.color}
                            border={link.color} 
                            text={link.text_color} 
                            style={styles.card}
                            key={link.id} >
                                <Card.Img 
                                    variant="top" 
                                    src={link.img} 
                                    style={styles.cardImage}/>
                                <Card.Body >
                                    <Card.Title className="font-semibold">{link.title}</Card.Title>
                                    <Card.Text className="py-2 pb-2">
                                        {link.desc}
                                    </Card.Text>
                                    <Button 
                                        href={link.source} 
                                        variant={link.text_color}
                                        className = "hover:scale-105 duration-500"
                                        active 
                                        style={styles.button}>Source code </Button>

                                </Card.Body>

                                <Card.Footer >     
                                    {Object.keys(link.tags).map((key, index) => ( 
                                        <Badge key={index} bg={link.tags[key]}>{key}</Badge>
                                    ))}
                                </Card.Footer>
                        </Card>
                    ))}

                </div>
        </div>
    )
}

export default Grid;