const  months = ["January","February","March","April","May","June","July","August","September","October","November","December"];


export const getNumberArray = (start, end) => {
    const numberArray = [];
    for (let index = start; index <= end; index++) {
        numberArray.push(index);
    }


    return numberArray;
}


export default months