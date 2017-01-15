//console.log(clj_fuzzy.metrics.jaro_winkler('Dwayne', 'Duane'))

//------User interface for entity resolution

//---Expect data in csv, columns with first and last name
//read in test data

d3.csv("data/names.csv", function(data){
  //assign unique IDs to each and CID (will be reassigned)
  var idCount = 1
  data.forEach(function(d){
    d.id = idCount
    d.cid = idCount
    idCount += 1
  })

  manMatch(data, 0.8)

  console.log(matchedData)





});

//function to compare all attributes and return average
function matchUp(obj1, obj2, fields){
  score = []

  //for each field specified, get JW score
  fields.forEach(function(field){
    score.push(clj_fuzzy.metrics.jaro_winkler(obj1[field], obj2[field]))
  })

  //take avg of score
  score = math.mean(score)

  return score
}

function copy(arr){
    var new_arr = arr.slice(0);
    for(var i = new_arr.length; i--;)
        if(new_arr[i] instanceof Array)
            new_arr[i] = copy(new_arr[i]);
    return new_arr;
}

Array.prototype.multisplice = function(){
    var args = Array.apply(null, arguments);
    args.sort(function(a, b){
        return a - b;
    });
    for(var i = 0; i < args.length; i++){
        var index = args[i] - i;
        this.splice(index, 1);
    }
}

function autoMatch(df, tHold){
  //look for matches based on threshold (automatic method)
  threshold = tHold
  remainingData = copy(df)
  matchedData = []

  while(remainingData.length > 0){
    matchedData.push(remainingData[0])
    runs = remainingData.length
    deleteID = []
    for(i=1; i < runs; i++){
      matchScore = matchUp(remainingData[0], remainingData[i], ['LastName','FirstName'])
      if(matchScore > threshold){
        remainingData[i].cid = remainingData[0].cid
        matchedData.push(remainingData[i])
        deleteID.push(remainingData[i].id)
      } else{
        //console.log('no match')
      }
    }

    for(i=0; i < deleteID.length; i++){
      remainingData = remainingData.filter(function(d){
        return d.id !== deleteID[i]
      })
    }
    remainingData = remainingData.filter(function(d){
      return d.id !== remainingData[0].id
    })
  }
}


function manMatch(df, tHold){
  //prompt if over a threshold
  threshold = tHold
  remainingData = copy(df)
  matchedData = []

  while(remainingData.length > 0){
    matchedData.push(remainingData[0])
    runs = remainingData.length
    deleteID = []
    for(i=1; i < runs; i++){
      matchScore = matchUp(remainingData[0], remainingData[i], ['LastName','FirstName'])
      if(matchScore > threshold){
        if (confirm('Match: ' + remainingData[0].FirstName + ' ' + remainingData[0].LastName + ' and ' + remainingData[i].FirstName + ' ' + remainingData[i].LastName)) {
          remainingData[i].cid = remainingData[0].cid
          matchedData.push(remainingData[i])
          deleteID.push(remainingData[i].id)
        } else {
        }
      } else{
        //console.log('no match')
      }
    }

    for(i=0; i < deleteID.length; i++){
      remainingData = remainingData.filter(function(d){
        return d.id !== deleteID[i]
      })
    }
    remainingData = remainingData.filter(function(d){
      return d.id !== remainingData[0].id
    })
  }
}
