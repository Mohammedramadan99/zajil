import Express from 'express';

const app = Express();
app.use(Express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

export default app;
