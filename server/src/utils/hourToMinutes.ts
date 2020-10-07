export default function convertHourToMinutes(time:string){
    
    var [hour,min] = time.split(':').map(Number);

    return ((hour * 60) + min);
}