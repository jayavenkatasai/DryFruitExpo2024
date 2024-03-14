function generateGUID() {
    // Generate random hexadecimal digits
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    
    // Concatenate random hexadecimal digits to form a GUID
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}
var guid;
guid = generateGUID();
// console.log(guid)
if(!localStorage.getItem('GUID')){
    localStorage.setItem('GUID',guid)
}
guid=localStorage.getItem('GUID')
console.log(guid);
// Example usage
if (!sessionStorage.getItem('anotherPageLoaded')) {
document.getElementById("submit-link").addEventListener('click',function(){
    var names = document.getElementById("name-value").value;
    names=names.trim();
    //alert(names.length)
    if(/^[a-zA-Z0-9\s]{3,}$/.test(names)){
        localStorage.setItem('UserName',names)
      
        sessionStorage.setItem('anotherPageLoaded', true);
       
       // alert(guid);
       
        var apiname=localStorage.getItem('UserName')
        const url = 'https://stage.marketcentral.in/rest/virtualExpo/general/AddVisitors';
        const requestBody = {
            exhibition_ID: 3,
            visitor_guid: guid,
            visitor_name: apiname,
            ipaddress: ipAddress
        };
        
        async function postData(url, data) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    // headers: {
                    //     'Content-Type': 'application/json'
                    // },
                    body: JSON.stringify(data)
                });
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                window.location.replace("categorymapdynmic.html")
                // const responseData = await response.json();
                // console.log('Response:', responseData);
                
            } catch (error) {
                console.error('There was a problem with the request:', error);
                alert(error)
            }
        }
        
        postData(url, requestBody);
        // Load another page
       
      
        

    }else{
        alert("conditions not satisfied")
    }
    // alert(names)
    // console.log(`the local storage name is${localStorage.getItem('UserName')}`)
})
}
else{
    window.location.replace("welcomeback.html")
}
