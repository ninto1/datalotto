var printer = null
const printEntry = (keyvalues, ticket,mode)=>{
  if(mode===1&&printer===null){
      //TODO: Init printer
  }
  console.log(" +-+-+-+-+-+-+-+-+-+\n" +
      " |D|a|t|a|l|o|t|t|o|\n" +
      " +-+-+-+-+-+-+-+-+-+")
    if(mode===1) {
        printer.clear()
        printer.println("+-+-+-+-+-+-+-+-+-+");
        printer.println("|D|a|t|a|l|o|t|t|o|");
        printer.println("+-+-+-+-+-+-+-+-+-+");
    }
    console.log("\nTicket number: "+ticket+"\n")
    if(mode===1)printer.println("\nTicket  number: "+ticket+"\n")
    keyvalues.forEach(e=>{
        console.log(e.name+": "+e.value)
        if(mode===1)printer.println(e.name+": "+e.value)
    })

    if(mode===1){printer.cut()
    printer.execute()}
}

module.exports={printEntry:printEntry}