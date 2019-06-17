
// Literal List
(
    <List>
        <List.Item>
            <Link to="/this/that">
                <List.Item.Title>Hey</List.Item.Title>
            </Link>
        </List.Item>
        <List.Item>
            <Link to="/this/that">
                <List.Item.Title>Hey</List.Item.Title>
            </Link>
        </List.Item>
        <List.Item>
            <Link to="/this/that">
                <List.Item.Title>Hey</List.Item.Title>
            </Link>
        </List.Item>
    </List>
)

(
    <List items={items} >
    { item => {
        return (
            <Link to="/">

            </Link>
        )
    } }
    </List>
)
