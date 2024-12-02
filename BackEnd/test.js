const axios = require('axios');

/*this is a test*/
/*Sign in example */
async function register()
{
    const formData = {
        FirstName: 'Emi',
        LastName: 'Lamkia',
        PhoneNumber:1234567891,
        Email: 'example@example2.com',
        Password: 'examplePassword2'
    };
    
    console.log(JSON.stringify(formData));
    const res=await fetch('http://localhost:3000/signup',{
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(formData)
    });
    console.log(res);
}



/*wow 3*/
/**Emi sxolio  */
  async function signupOrg() {
    try 
    {
      const postData = 
      {
        FirstName: 'Emi',
        LastName: 'Lamkia',
        PhoneNumber:1234567893213,
        email: 'example@example2.com',
        password: 'examplePassword2'
      };
  
      const response = await axios.post('http://localhost:3000/signuporg', postData);
      console.log('Απάντηση από τη βάση δεδομένων:', response.data);
      console.log('Status code:', response.status);
    } 
    catch (error) 
    {
      console.error('Σφάλμα κατά την εκτέλεση του POST request:', error.message);
      if (error.response) 
        {
            console.error('Απόκριση από τον server:', error.response.data);
            console.error('Status code από τον server:', error.response.status);
        }     
        else if (error.request) 
        {
            console.error('Αίτημα στάλθηκε, αλλά δεν έλαβες απάντηση:', error.request);
        } 
      else 
      {
        console.error('Άγνωστο σφάλμα:', error.message);
      }
    }
  }



async function login()
{
    const user={
        email: 'example@example2.com',
        password: 'examplePassword2'
    }

    try
    {
        const response=await axios.post('http://localhost:3000/login',user);
        console.log('��πάντηση από τη ��άση ��εδομένων:', response.data);
        console.log('Status code:', response.status);
    }
    catch(error)
    {
        console.error('Σφάλμα κατά την εκτέλεση του POST request:', error.message);
        if (error.response) 
          {
              console.error('Απόκριση από τον server:', error.response.data);
              console.error('Status code από τον server:', error.response.status);
          }     
          else if (error.request) 
          {
              console.error('Αίτημα στάλθηκε, αλλά δεν έλαβες απάντηση:', error.request);
          } 
        else 
        {
          console.error('Άγνωστο σφάλμα:', error.message);
        }
    }
}

register();


