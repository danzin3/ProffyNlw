import {Request,Response} from 'express';

import db from '../database/connection';
import convertHourToMinutes from '../utils/hourToMinutes';


interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

export default class ClassesController {
    
    async index (request:Request,response:Response) {
        var filters = request.query;

        if(!filters.week_day || !filters.subject || ! filters.time) {
            return response.status(400).json({msg:"Filtros Vazios"});
        }

        var timeInMinutes = convertHourToMinutes(filters.time as string);

        const classes = await db('classes')
        .whereExists(function(){
            this.select('class_schedule.*')
            .from('class_schedule')
            .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
            .whereRaw('`class_schedule`.`week_day` = ??',[Number(filters.week_day)])
            .whereRaw('`class_schedule`.`from` <= ??',[timeInMinutes])
            .whereRaw('`class_schedule`.`to` > ??',[timeInMinutes])
        })
        .where('classes.subject','=',filters.subject as string)
        .join('users','classes.user_id','=','users.id')
        .select(['classes.*','users.*']);

        return response.status(201).json(classes);
    }
    
    
    async create (request:Request,response:Response) {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = request.body;
        /** Isso feito em cima se chama desestruturação
         * Os campos que virão do front dentro do body são separados em variáveis
         * diferentes. 
        */
        
        const trx = await db.transaction();
    
        try {
            const idsInseridos = await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio,
            });
            /** O nome do campo é o mesmo nome da variável do objeto desestruturado,
             * logo ao colocar la dentro o knex já insere os dados na tabela automatico
             * Todo insert no knex me retorna um lista dos Ids inseridos
             */
            
            const user_id = idsInseridos[0];
        
            const idsClasses = await trx('classes').insert({
                subject,
                cost,
                user_id,
            });
        
            const class_id = idsClasses[0];
        
            const classSchedule =schedule.map((item:ScheduleItem) => {
                return {
                    class_id,
                    week_day: item.week_day,
                    from: convertHourToMinutes(item.from),
                    to: convertHourToMinutes(item.to),
                };
            });
        
            await trx('class_schedule').insert(classSchedule);
        
            await trx.commit();
    
            return response.status(201).json({msg:"Dados Inseridos com Sucesso!"});
        } catch(err) {
            //Ideal seria armazenar esse erro em algum arquivo ou tabela do banco
            await trx.rollback();
            return response.status(400).json({msg:"Erro ao inserir os registros "});
        }
    }
}