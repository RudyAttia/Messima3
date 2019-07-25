//SIZE PAGE
document.getElementsByTagName('section')[0].style.height = window.innerHeight-80 +"px";
document.getElementById('customers').style.height = window.innerHeight-116 +"px";
document.getElementById('details').style.height = window.innerHeight-106 +"px";
document.getElementById('details').style.width = (document.getElementsByTagName('section')[0].offsetWidth - 353) +"px";


let compnamearray = [];
let custidnow = "";
let custdnow = true;

//FETCH CUSTOMERS
fetch('http://localhost:5000/api/customers').then(
        (response)=>response.json()
    ).then(
        (res)=>{
            compnamearray = res.message;
            displaycustomers(res.message)
        }
    ).catch(
        (err)=>console.log(err)
)

//SEARCH
function searchcust(){
    custidnow = "";
    let thesearch = document.getElementById("inputsearchcust").value;
    if(thesearch === ""){displaycustomers(compnamearray)}
    else{
        let newcomparr = [];
        for(i=0;i<compnamearray.length;i++){
            if(thesearch.toLowerCase() === compnamearray[i].CompanyName.substring(0, thesearch.length).toLowerCase()){
                newcomparr.push(compnamearray[i])
            }
        }
        displaycustomers(newcomparr);
    }
}

//DISPLAY CUTOMERS
function displaycustomers(arrcusts){
    document.getElementById('customers').innerHTML= arrcusts.map(cust=> `<div class="compname" id="${cust.CustomerID}i" onclick="selectcustomer('${cust.CustomerID}','${cust.CompanyName.replace("'","\\'")}',event)" >${cust.CompanyName}</div>`).join('');
}
function selectcustomer(custid, custname,e){
    if(custidnow){document.getElementById(custidnow+"i").style.backgroundColor = "";}
    custidnow = custid;
    e.target.style.backgroundColor = "#dddddd";
    document.getElementById("ccustdetail").addEventListener('click',()=>{fetchcustdetails(custidnow)})
    document.getElementById("corder").addEventListener('click',()=>{fetchorder(custidnow)})
    document.getElementById("namecust").innerHTML = `<strong>${custname}</strong>`
    if(custdnow){fetchcustdetails(custid)}
    else{fetchorder(custid)}
}

//FETCH CUSTOMER DETAILS
function fetchcustdetails(custid){
    custdnow = true;
    fetch('http://localhost:5000/api/custdetails/'+custid).then(
        (response)=>response.json()
    ).then(
        (res)=>{
            document.getElementById("ccustdetail").style.backgroundColor = "white";
            document.getElementById("corder").style.backgroundColor = "";
            document.getElementById("ccustdetail").style.borderBottom = "1px white solid";
            document.getElementById("corder").style.borderBottom = "1px gray solid";
            let keysdetails = Object.keys(res.message[0])
            let buffer = ""
            for(i=0;i<keysdetails.length;i++){
                buffer+=`<tr><th class="thcd">${keysdetails[i]}</th><td>${res.message[0][keysdetails[i]]}</td></tr>`
            }
            document.getElementById('details').innerHTML = '<div id="detcustdet"><table id="tablecd">'+buffer+'</table></div>';
        }
    ).catch(
        (err)=>console.log(err)
    )
}

// FETCH ORDERS
function fetchorder(custid){
    custdnow = false;
    fetch('http://localhost:5000/api/order/'+custid).then(
        (response)=>response.json()
    ).then(
        (res)=>{
            document.getElementById("ccustdetail").style.backgroundColor = "";
            document.getElementById("corder").style.backgroundColor = "white";
            document.getElementById("ccustdetail").style.borderBottom = "1px gray solid";
            document.getElementById("corder").style.borderBottom = "1px white solid";
            if(res.state === "error"){
                document.getElementById('details').innerHTML ="<strong>NO RESULT</strong>";
                return
            }
            let keysdetails = Object.keys(res.message[0])
            let buffer = "<tr>"
            for(i=0;i<keysdetails.length;i++){
                buffer += `<th>${keysdetails[i]}</th>`
            }
            buffer+="</tr>"
            for(i=0;i<res.message.length;i++){
                buffer += `<tr class="oddt" onclick="fetchorderdetails(${res.message[i]['OrderID']})">`
                for(j=0;j<keysdetails.length;j++){
                    buffer+=`<td>${res.message[i][keysdetails[j]]}</td>`
                }
                buffer+="</tr>"
            }
            document.getElementById('details').innerHTML = `<div id="intop"><table>${buffer}</table></div>
                                                            <div id="inbottom"><div id="odtitle"><strong>order detail</strong></div><div id="orddetails"></div></div>`;
        }
    ).catch(
        (err)=>console.log(err)
    )
}

//FETCH ORDER DETAILS
function fetchorderdetails(prodId){
    fetch('http://localhost:5000/api/orderdetails/'+prodId).then(
        (response)=>response.json()
    ).then(
        (res)=>{
            let keysdetails = Object.keys(res.message[0])
            let totalpay = 0;
            let buffer = "<tr>"
            for(i=0;i<keysdetails.length;i++){
                buffer += `<th>${keysdetails[i]}</th>`
            }
            buffer+="</tr>"
            for(i=0;i<res.message.length;i++){
                totalpay += (res.message[i].UnitPrice * res.message[i].Quantity)
                buffer += `<tr>`
                for(j=0;j<keysdetails.length;j++){
                    buffer+=`<td>${res.message[i][keysdetails[j]]}</td>`
                }
                buffer+="</tr>"
            }
            document.getElementById('odtitle').innerHTML = `<strong>order detail: ${res.message[0].OrderID}</strong><span> Total Price: ${totalpay.toFixed(2)} </span>`;
            document.getElementById('orddetails').innerHTML=`<table>${buffer}</table>`;
            document.getElementById('orddetails').style.height= document.getElementById('inbottom').offsetHeight - 28 +"px";

        }
    ).catch(
        (err)=>console.log(err)
    )
}