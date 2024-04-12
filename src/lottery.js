var currentPot = [];
const generateTicket = ()=>{
    return [...Array(4)].map(()=>[...Array(2)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')).join(' ')
}
 const newTicket=()=>{
    let num = generateTicket();
    while(currentPot.includes(num))num=generateTicket();
    currentPot.push(num)
    //console.log(currentPot)
    return num
}
const draw = ()=>{
    if(currentPot.length===0)return null
    let windex = Math.floor(Math.random() * currentPot.length);
    let winner = currentPot[windex];
    currentPot.splice(windex, 1);
    //console.log(currentPot)
    return winner
}
module.exports = {newTicket:newTicket,draw:draw}

