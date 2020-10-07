import React, { useState, FormEvent } from 'react';
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem'
import Input from '../../components/Inputs';
import Select from '../../components/Select';
import api from '../../services/api';

import './styles.css';


function TeacherList() {

    var [teachers, setTeachers] = useState([]);
    var [subject,setSubject] = useState('');
    var [week_day,setWeek_day] = useState('');
    var [time,setTime] = useState('');

    async function searchTeachers(e: FormEvent) {
        e.preventDefault();
        console.log(week_day,subject,time)
        const response = await api.get('/classes',{
            params:{
                week_day,
                subject,
                time
            }
        })
        setTeachers(response.data);
    }
    
    return (
        <div id="page-teacher-list" className="container">
            <PageHeader title="Esses são os nossos professores">
                <form id="search-teachers" onSubmit={searchTeachers}>

                    <Select 
                        name="subject" 
                        label="Matéria"
                        value={subject}
                        onChange={(event) => {setSubject(event.target.value)}}
                        options={[
                            {value: 'Artes', label: 'Artes'},
                            {value: 'Biologia', label: 'Biologia'},
                            {value: 'Matemática', label: 'Matemática'},
                            {value: 'Fisica', label: 'Física'},
                            {value: 'Algoritmos', label: 'Algoritmos'},
                            {value: 'Quimica', label: 'Química'},
                    ]}/>

                    <Select 
                        name="week_day"
                        label="Dia da Semana"
                        value={week_day}
                        onChange={(event) => {setWeek_day(event.target.value)}}
                        options={[
                            {value: '0', label: 'Domigo'},
                            {value: '1', label: 'Segunda'},
                            {value: '2', label: 'Terça'},
                            {value: '3', label: 'Quarta'},
                            {value: '4', label: 'Quinta'},
                            {value: '5', label: 'Sexta'},
                            {value: '6', label: 'Sábado'},
                    ]}/>
                    
                    <Input
                    type="time"
                    name="time"
                    label="Hora"
                    value={time}
                    onChange={(event) => {setTime(event.target.value)}}
                    />

                    <button id="btEnviar" type="submit">Pesquisar</button>
                </form>
                
            </PageHeader>
            <main>
                {teachers.map((teacher:Teacher) => {
                    return <TeacherItem key={teacher.id} teacher={teacher}/>
                })}
            </main>
        </div>
    )
}
export default TeacherList;