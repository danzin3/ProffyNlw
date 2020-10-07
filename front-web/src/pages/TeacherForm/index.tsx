import React, {useState, FormEvent} from 'react';
import {useHistory} from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Input from '../../components/Inputs';
import warningIcon from '../../assets/images/icons/warning.svg';
import Textarea from '../../components/TextArea';
import Select from '../../components/Select';
import api from '../../services/api';

import './styles.css'



function TeacherForm() {
    var history = useHistory();
    var [name,setName] = useState('');
    var [avatar,setAvatar] = useState('');
    var [whatsapp,setWhatsapp] = useState('');
    var [bio,setBio] = useState('');

    var [subject,setSubject] = useState('');
    var [cost,setCost] = useState('');

    const [scheduleItems, setScheduleItems] = useState([
        { week_day: 0, from: '', to: ''},
    ]);

    function addNewScheduleItem(){
        setScheduleItems([
            ...scheduleItems,
            { week_day: 0, from: '', to: ''}
        ]);
    }

    function handleCreateClass(event: FormEvent){

        event.preventDefault();

        api.post('/classes',{
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost: Number(cost),
            schedule: scheduleItems
        }).then(() => {
            alert('Cadastro Realizado com Sucesso!');
            history.push('/');
        }).catch(() => {
            alert('Erro no Cadastro!');
        });

        
    }

    function setScheduleItemValue (position: number, field: string, value: string) {
        const newArray = scheduleItems.map((Item,index) => {
            if(index === position){
                return { ...Item, [field]:value };
            }
            return Item;
        } );
        setScheduleItems(newArray);
    }

    return (
        <div id="page-teacher-form" className="container">
            <PageHeader 
                title="Que incrível que você quer dar aulas"
                description="O primeiro passo é preencher esse formulário de inscrição"
            />

            <main>
                <form onSubmit={handleCreateClass}>
                <fieldset>
                    <legend>Seus Dados</legend>

                    <Input 
                        name="name"
                        label="Nome Completo"
                        value={name}
                        onChange={(event) => {setName(event.target.value)}}
                    />
                    <Input 
                        name="avatar" 
                        label="Avatar"
                        value={avatar}
                        onChange={(event) => {setAvatar(event.target.value)}}
                    />
                    <Input 
                        name="whatsapp" 
                        label="Whatsapp"
                        value={whatsapp}
                        onChange={(event) => {setWhatsapp(event.target.value)}}
                    />
                    <Textarea 
                        name="bio" 
                        label="Biografia"
                        value={bio}
                        onChange={(event) => {setBio(event.target.value)}}
                    />

                </fieldset>

                <fieldset>
                    <legend>Sobre a Aula</legend>

                    <Select 
                        name="subject" 
                        label="Matéria" 
                        value={subject} 
                        onChange={(event)=>{ setSubject(event.target.value) }}
                        options={[
                            {value: 'Artes', label: 'Artes'},
                            {value: 'Biologia', label: 'Biologia'},
                            {value: 'Matemática', label: 'Matemática'},
                            {value: 'Físia', label: 'Físia'},
                            {value: 'Algoritmos', label: 'Algoritmos'},
                            {value: 'Quimica', label: 'Quimica'},
                        ]}/>
                    <Input 
                        name="cost"
                        label="Custo da sua hora por aula"
                        value={cost} 
                        onChange={(event)=>{ setCost(event.target.value) }}
                    />
                    
                </fieldset>

                <fieldset>
                    <legend>
                        Seus Horários:
                        <button type="button" onClick={addNewScheduleItem}>
                            + Novo Horário
                        </button>
                    </legend>
                    
                    {scheduleItems.map((Item, index) => {
                        return (
                            <div key={Item.week_day} className="schedule-item">
                                <Select 
                                    name="week_day" 
                                    label="Dia da Semana"
                                    value={Item.week_day}
                                    onChange={e => setScheduleItemValue(index,'week_day',e.target.value)} 
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
                                    name="from" 
                                    label="Das" 
                                    type="time"
                                    value={Item.from}
                                    onChange={e => setScheduleItemValue(index,'from',e.target.value)}
                                />
                                <Input 
                                    name="to" 
                                    label="Até" 
                                    type="time"
                                    value={Item.to}
                                    onChange={e => setScheduleItemValue(index,'to',e.target.value)}
                                />
                            </div>
                        );
                    })}

                </fieldset>

                <footer>
                    <p>
                        <img src={warningIcon} alt="Aviso Importante"/>
                        Importante! <br/>
                        Preencha Todos os Dados
                    </p>
                    <button type="submit">
                        Salvar
                    </button>
                </footer>
                </form>
            </main>
        </div>
    )
}
export default TeacherForm;