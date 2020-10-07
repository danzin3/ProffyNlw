import knex from 'knex';
import path from 'path';

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite')  
    },
    useNullAsDefault: true,
    /** O sqlite precisa de receber informação do que fazer quando não há valores
     * passados... no caso quando não tem nada ele vai usar o null como padrão.
     */
});

export default db;