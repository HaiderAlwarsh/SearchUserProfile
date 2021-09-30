const APIURL = "https://api.github.com/users/";

const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');

// Get user name from input field
async function getUser(userName){

    const resp  = await fetch(APIURL + userName,
        {
            method:'Get',
            headers:{
                'content-type' : 'application/vnd.github.v3+json',
            },
        }
    );

    if(resp.ok){
        
        const respData = await resp.json();

        //when he get the data create two functions
        createUserCard(respData); // create the card
        getRepos(userName); // To get other info(user repository)
    }
}

// get user repository
async function getRepos(userName){
    const resp  = await fetch(APIURL + userName + "/repos",
        {
            method:'Get',
            headers:{
                'content-type' : 'application/vnd.github.v3+json',
            },
        }
    );

    if(resp){
        const respData = await resp.json();
        //when it's succeeded to get data, will create new function (to add repository to card)
        addReposToCard(respData);
    }  
}

//create the card 
function createUserCard(userInfo){
    const card = `
        <div class="card">
            <div>
                <img class="avatar" src="${userInfo.avatar_url}" alt="${userInfo.name}">
            </div>
            <div class="right-side">
                <h2 class='right-side-username'>${userInfo.name}</h2>
                <p class="right-side-userBio">${userInfo.bio}</p>

                <ul class="info">
                    <li>${userInfo.followers} <strong>Followers</strong></li>
                    <li>${userInfo.following} <strong>Following</strong></li>
                    <li>${userInfo.public_repos} <strong>Repos</strong></li>
                </ul>

                <h4 class="reposTitle">Repos:</h4>
                <ul id="repos"></ul>
            </div>
        </div>
    `;

    main.innerHTML = card;
}

//add repository to the card
function addReposToCard(userRepos){
    const repos = document.getElementById("repos");
    
    // will sorted depend on the repo stars
    userRepos.sort((a,b) => b.stargazers_count - a.stargazers_count).slice(0, 10).forEach(userRepo => {
        const li = document.createElement('li');
        const a = document.createElement('a');

        a.href = userRepo.html_url;
        a.textContent = userRepo.name;
        
        li.append(a)
        repos.append(li)
        
    })
}

form.addEventListener('submit', (e) => {

    const userName = search.value;
    e.preventDefault();

    //will check if input field is empty or not
    if(userName){
        getUser(userName)

        search.value = "";
    }
}) 