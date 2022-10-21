const Home = (props) => {
    const {
        events = [],
    } = props;

    return (
        <section>
            <h1>Home Page</h1>
            <div>
                {events}
            </div>
        </section>
    );
}

export default Home;