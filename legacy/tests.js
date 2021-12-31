    
      var string = "s@gmail.com"
      var regex = /<(.*)>/g; // regex to parse the email
      var matches = regex.exec(string);
      if (matches !== null){
        var text = `from:${matches[1]}`
      }else{
        var text = `from:${string}`;
      }  
      console.log (text)