const formInput = document.querySelector(".form__input");
const formList = document.querySelector(".form__list");
const LikedRepoList = document.querySelector(".list__repo--liked");
const delBtn = document.querySelector(".del__btn");
let resArrLikedId = [];

async function searchRepo(nameRepo) {
  let resArr = [];
  formList.innerHTML = "";

  if (nameRepo.trim().length !== 0) {
    let url = `https://api.github.com/search/repositories?q=${nameRepo.trim()}`;
    let response = await fetch(url);
    let data = await response.json();
    resArr = [...data.items];
    let counter = 1;
    resArr.forEach((value) => {
      if (counter <= 5 || resArr.length <= 5) {
        const elList = document.createElement("span");
        elList.classList.add("list__el");
        elList.setAttribute("id", value.id);
        elList.setAttribute("login", value.owner.login);
        elList.setAttribute("stars_count", value.stargazers_count);
        let valueSlice = value.name;
        if (valueSlice.length >= 27)
          valueSlice = `${valueSlice.slice(0, 27)}...`;
        const stateValue = {
          id: value.id,
          name: valueSlice,
          owner: value.owner.login,
          stars: value.stargazers_count,
        };
        elList.onclick = (e) => {
          formInput.value = "";
          formList.innerHTML = "";
          createLikedRepo(e, stateValue);
        };
        elList.textContent = valueSlice;
        formList.appendChild(elList);
      }
      counter += 1;
    });
  }
}

const debFunc = () => {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      searchRepo(formInput.value);
    }, 700);
  };
};

const createLikedRepo = (objRepo, stateValue) => {
  const atrClsssName = {
    name: "el__name",
    owner: "el__owner",
    stars: "el__stars",
  };
  const repoEl = document.createElement("div");
  repoEl.setAttribute("id", stateValue.id);
  repoEl.classList.add("repo__el");

  for (key in atrClsssName) {
    let valueSlice = stateValue[key];
    if (valueSlice.length >= 24) valueSlice = `${valueSlice.slice(0, 24)}...`;

    const parEl = document.createElement("p");
    parEl.classList.add(atrClsssName[key]);
    parEl.textContent = `${
      String(key).toUpperCase()[0] + String(key).slice(1, key.length)
    }: ${valueSlice}`;
    repoEl.appendChild(parEl);
  }

  const btnEl = document.createElement("div");
  btnEl.classList.add("del__btn");
  repoEl.appendChild(btnEl);
  LikedRepoList.prepend(repoEl);
  resArrLikedId.unshift(stateValue.id);
  if (resArrLikedId.length > 3) {
    const repoElAll = document.querySelectorAll(".repo__el");
    for (value of repoElAll) {
      if (Number(value.id) === resArrLikedId.at(-1))
        LikedRepoList.removeChild(value);
    }
    resArrLikedId = resArrLikedId.slice(0, 3);
  }
};

formInput.addEventListener("input", debFunc());

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("del__btn")) {
    LikedRepoList.removeChild(e.target.closest(".repo__el"));
  }
});
