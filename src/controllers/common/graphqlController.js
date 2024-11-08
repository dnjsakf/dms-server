import { ruruHTML } from 'ruru/server';

const getGraphiql = async (req, res) => {
    try {
        res.type('html');
        res.status(200);
        res.end(ruruHTML({ endpoint: '/api/graphql' }));
    } catch ( error ){
        res.status(400).json({ message: error.message });
    }
}

export {
    getGraphiql
}
