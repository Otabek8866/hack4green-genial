var listDiv = document.getElementById("box-2-list");
var listSelectedDiv = document.getElementById("box-2-list-selected");
var mustHaveID = [];
var phasesData = []

// Toggle box2 when cartBtn is clicked

function hideBox2() {
  var box2 = document.querySelector('#box2');
  if (box2.style.display === "none") {
    box2.style.display = "block";
  } else {
    box2.style.display = "none";
  }
}

function hideBox1() {
  var page1 = document.querySelector('#page1');
  var page2 = document.querySelector('#page2');

  if (page1.style.display === "") {
    page1.style.display = "none";
    page2.style.display = "block";
  }
}

function getRecom(category) {
  var div = document.getElementById("sub-items-"+category);

  if (div.innerHTML == "") {

    fetch("http://141.94.250.91/category?cat="+category)
      .then((res) => { return res.json() })
      .then(post => {
        for (let i = 0; i < post.length; i++) {
          div.innerHTML += `
      <div class="accordion-item">
    <h2 class="accordion-header">
      <button type="button" class="accordion-button collapsed" data-bs-toggle="collapse"
        data-bs-target="#collapse-${post[i].id}" id="${post[i].id}" onclick="getCriterias.call(this)">${post[i].name}</button>
    </h2>
    <div id="collapse-${post[i].id}" class="accordion-collapse collapse">
      <div class="card-body">
        <div id="${post[i].id}-C"></div>
      </div>
    </div>
  </div>
      `;
        }

      })
  }
}


function getCriterias() {
  var div = document.getElementById(this.id + "-C");
  if (div.innerHTML == "") {
    fetch("http://141.94.250.91/recom/" + this.id)
      .then((res) => { return res.json() })
      .then(post => {
        for (let i = 0; i < post.length; i++) {
          div.innerHTML += `
        <input type="checkbox" value="${post[i].ID}" id="${post[i].ID}" class="checkbox" onclick='handleClick(this);'> <span class="inputWrapper"> ${post[i].Criteria}</span><br>
    `;
        }

      })
  }



}

function handleClick(cb) {
  if (cb.checked == true){
    var li = document.createElement("li");
    li.innerHTML = document.getElementById(cb.value).nextElementSibling.innerText
    li.id = cb.value+'-S';
    listSelectedDiv.appendChild(li);
  }
  else  {
    var li = document.getElementById(cb.value+'-S');
    listSelectedDiv.removeChild(li);

  }
}

function getCategories() {
  var categories = ['Strategy', 'Specifications', 'UX-UI', 'Contents', 'Frontend', 'Architecture', 'Backend']
  var div = document.getElementById("myAccordion1");
  // console.log(div);

  for (const category of categories) {
    div.innerHTML += `
    <!-- Item 1 -->
    <div class="accordion-item">
      <h2 class="accordion-header" id="headingOne">
        <button type="button" class="accordion-button collapsed" data-bs-toggle="collapse"
          data-bs-target="#collapse-${category}" onclick="getRecom('${category}')">${category}</button>
      </h2>
      <div id="collapse-${category}" class="accordion-collapse collapse">
        <div class="card-body">
          <!-- Sub Item Start-->

          <div id="sub-items-${category}"></div>

          <!-- Sub Item End -->

        </div>
      </div>
    </div>

    <!-- Item 1 End -->
    `;
  }

}

function fillMustHave() {
  var div = document.getElementById("box-2-list");
    fetch("http://141.94.250.91/must")
      .then((res) => { return res.json() })
      .then(post => {
        
        for (let i = 0; i < post.length; i++) {
          mustHaveID.push(post[i].ID);
          div.innerHTML += `
          <li id=${post[i].ID}>${post[i].Criteria}</li>
      `;
        }

      })
  
}

function sendIds(){
  document.getElementById("cartBtn").style.display = "none"
  var array = [];
  var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
  for (var i = 0; i < checkboxes.length; i++) {
    array.push(checkboxes[i].value);
  }


    fetch("http://141.94.250.91/summary/"+(mustHaveID.concat(array)).join())
      .then((res) => { return res.json() })
      .then(post => {
        phasesData = post;
        makePhases()
        hideBox1()
      })



  // window.location.href = "http://141.94.250.91/summary/"+(mustHaveID.concat(array)).join();
}

function makePhases(){
  var div = ""

  var v1 = document.getElementById("pannel-Acquisition")
  var v2 = document.getElementById("pannel-Conception")
  var v3 = document.getElementById("pannel-Production")
  var v4 = document.getElementById("pannel-Deployment")
  var v5 = document.getElementById("pannel-Administration")
  var v6 = document.getElementById("pannel-Utilization")
  var v7 = document.getElementById("pannel-Maintenance")
  var v8 = document.getElementById("pannel-End-of-Life")
  var v9 = document.getElementById("pannel-Revaluation")


  for (const phase of phasesData){
    var id = phase.id.replace(".","")

    const expr = phase.lifecycle;
    switch (expr) {
      case 'Acquisition':
        div = v1
        break;
      case 'Conception':
        div = v2
      case 'Production':
        div = v3        
        break;
      case 'Deployment':
        div = v4
        break;
      case 'Administration':
        div = v5
        break;
      case 'Utilisation':
        div = v6
        break;
      case 'Maintenance':
        div = v7
        break;
      case 'End-of-Life':
        div = v8
        break;
      case 'Revaluation':
        div = v9
        break;

      default:
        console.log(`Sorry, we are out of ${expr}.`);
    }

      
      div.innerHTML += `

      <div class="col-4" id="box-p2">
      <div class="card mb-5 mb-lg-0">
        <!-- <div class="card-body"> -->
          <h6 class="card-price text-center">${phase.criteria}</h6>
          <hr>
          <div class="accordion">
    
    
    
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button type="button" class="accordion-button collapsed" data-bs-toggle="collapse"
                  data-bs-target="#collapseK1-${id}">Key Step</button>
              </h2>
              <div id="collapseK1-${id}" class="accordion-collapse collapse">
                <div class="card-body">
                <p>${phase.keystep1}</p>
                </div>
              </div>
            </div>
    
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button type="button" class="accordion-button collapsed" data-bs-toggle="collapse"
                  data-bs-target="#collapseK2-${id}">Information</button>
              </h2>
              <div id="collapseK2-${id}" class="accordion-collapse collapse">
                <div class="card-body">
                <p>${phase.keystep2}</p>
                </div>
              </div>
            </div>
    
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button type="button" class="accordion-button collapsed" data-bs-toggle="collapse"
                  data-bs-target="#collapseO1-${id}">Need To Do</button>
              </h2>
              <div id="collapseO1-${id}" class="accordion-collapse collapse">
                <div class="card-body">
                <p>${phase.outcome1}</p>
                </div>
              </div>
            </div>
    
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button type="button" class="accordion-button collapsed" data-bs-toggle="collapse"
                  data-bs-target="#collapseO2-${id}">Result</button>
              </h2>
              <div id="collapse02-${id}" class="accordion-collapse collapse">
                <div class="card-body">
                <p>${phase.outcome2}</p>
                </div>
              </div>
            </div>
    
          </div>
    
    
        </div>
      </div>
      
      `

  }
}

function hideAllPhases(){
  let elements = document.querySelectorAll(".phase");
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.display = "none";
  }
  
}

function displayPhase(name){
  var element = document.getElementById(name)
  hideAllPhases()
  element.style.display = ""

}

getCategories();
fillMustHave();



// O

// GANT chart starts
anychart.onDocumentReady(function() {
  // create data
  var data = [{
      id: "1",
      name: "Acquisition",
      actualStart: Date.UTC(2018, 01, 02),
      actualEnd: Date.UTC(2018, 06, 15),
      children: [{
          id: "1_1",
          name: "Key_Step1_a",
          actualStart: Date.UTC(2018, 01, 02),
          actualEnd: Date.UTC(2018, 01, 22),
      }, {
          id: "1_2",
          name: "Key_Step1_b",
          actualStart: Date.UTC(2018, 01, 23),
          actualEnd: Date.UTC(2018, 02, 20),
      }, ]
  }, {
      id: "2",
      name: "Conception",
      actualStart: Date.UTC(2018, 01, 02),
      actualEnd: Date.UTC(2018, 06, 15),
      children: [{
          id: "2_1",
          name: "Key_Step1_a",
          actualStart: Date.UTC(2018, 01, 02),
          actualEnd: Date.UTC(2018, 01, 22),
      }, {
          id: "2_2",
          name: "Key_Step1_b",
          actualStart: Date.UTC(2018, 01, 23),
          actualEnd: Date.UTC(2018, 02, 20),
      }, ]
  }, {
      id: "3",
      name: "Production",
      actualStart: Date.UTC(2018, 01, 02),
      actualEnd: Date.UTC(2018, 06, 15),
      children: [{
          id: "3_1",
          name: "Key_Step1_a",
          actualStart: Date.UTC(2018, 01, 02),
          actualEnd: Date.UTC(2018, 01, 22),
      }, {
          id: "3_2",
          name: "Key_Step1_b",
          actualStart: Date.UTC(2018, 01, 23),
          actualEnd: Date.UTC(2018, 02, 20),
      }, {
          id: "3_3",
          name: "Key_Step1_c",
          actualStart: Date.UTC(2018, 02, 23),
          actualEnd: Date.UTC(2018, 03, 23),
      }, ]
  }, {
      id: "4",
      name: "Deployment",
      actualStart: Date.UTC(2018, 01, 02),
      actualEnd: Date.UTC(2018, 06, 15),
      children: [{
          id: "4_1",
          name: "Key_Step1_a",
          actualStart: Date.UTC(2018, 01, 02),
          actualEnd: Date.UTC(2018, 01, 22),
      }, {
          id: "4_2",
          name: "Key_Step1_b",
          actualStart: Date.UTC(2018, 01, 23),
          actualEnd: Date.UTC(2018, 02, 20),
      }, ]
  }, {
      id: "5",
      name: "Administration",
      actualStart: Date.UTC(2018, 01, 02),
      actualEnd: Date.UTC(2018, 06, 15),
      children: [{
          id: "5_1",
          name: "Key_Step1_a",
          actualStart: Date.UTC(2018, 01, 02),
          actualEnd: Date.UTC(2018, 01, 22),
      }, {
          id: "5_2",
          name: "Key_Step1_b",
          actualStart: Date.UTC(2018, 01, 23),
          actualEnd: Date.UTC(2018, 02, 20),
      }, {
          id: "5_3",
          name: "Key_Step1_c",
          actualStart: Date.UTC(2018, 02, 23),
          actualEnd: Date.UTC(2018, 03, 23),
      }, ]
  }, {
      id: "6",
      name: "Utilization",
      actualStart: Date.UTC(2018, 01, 02),
      actualEnd: Date.UTC(2018, 06, 15),
      children: [{
          id: "7_1",
          name: "Key_Step1_a",
          actualStart: Date.UTC(2018, 01, 02),
          actualEnd: Date.UTC(2018, 01, 22),
      }, {
          id: "7_2",
          name: "Key_Step1_b",
          actualStart: Date.UTC(2018, 01, 23),
          actualEnd: Date.UTC(2018, 02, 20),
      }, ]
  }, {
      id: "8",
      name: "Maintenance",
      actualStart: Date.UTC(2018, 01, 02),
      actualEnd: Date.UTC(2018, 06, 15),
      children: [{
          id: "8_1",
          name: "Key_Step1_a",
          actualStart: Date.UTC(2018, 01, 02),
          actualEnd: Date.UTC(2018, 01, 22),
      }, {
          id: "8_2",
          name: "Key_Step1_b",
          actualStart: Date.UTC(2018, 01, 23),
          actualEnd: Date.UTC(2018, 02, 20),
      }, ]
  }, {
      id: "9",
      name: "End of Life",
      actualStart: Date.UTC(2018, 01, 02),
      actualEnd: Date.UTC(2018, 06, 15),
      children: [{
          id: "9_1",
          name: "Key_Step1_a",
          actualStart: Date.UTC(2018, 01, 02),
          actualEnd: Date.UTC(2018, 01, 22),
      }, {
          id: "9_2",
          name: "Key_Step1_b",
          actualStart: Date.UTC(2018, 01, 23),
          actualEnd: Date.UTC(2018, 02, 20),
      }, {
          id: "9_3",
          name: "Key_Step1_c",
          actualStart: Date.UTC(2018, 02, 23),
          actualEnd: Date.UTC(2018, 03, 23),
      }, ]
  }, {
      id: "10",
      name: "Revaluation",
      actualStart: Date.UTC(2018, 01, 02),
      actualEnd: Date.UTC(2018, 06, 15),
      children: [{
          id: "10_1",
          name: "Key_Step1_a",
          actualStart: Date.UTC(2018, 01, 02),
          actualEnd: Date.UTC(2018, 01, 22),
      }, {
          id: "10_2",
          name: "Key_Step1_b",
          actualStart: Date.UTC(2018, 01, 23),
          actualEnd: Date.UTC(2018, 02, 20),
      }, ]
  }];

  // create a data tree
  var treeData = anychart.data.tree(data, "as-tree");

  // create a chart
  var chart = anychart.ganttProject();

  // set the data
  chart.data(treeData);
  // configure the scale
  chart.getTimeline().scale().maximum(Date.UTC(2018, 06, 30));
  // set the container id
  chart.container("container");
  // initiate drawing the chart
  chart.draw();
  // fit elements to the width of the timeline
  chart.fitAll();

  // chart.collapseAll();
});