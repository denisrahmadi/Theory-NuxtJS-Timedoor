import axios from "axios";
import Cookie from "js-cookie";

export const state = () => ({
  recipes: [],
  token: null,
  userData: null,
});

export const getters = {
  recipeData(state) {
    return state.recipes;
  },

  lastIdRecipes(state) {
    let recipeLength = state.recipes.length;
    return state.recipes[recipeLength - 1].id;
  },

  detailRecipe: (state) => (id) => {
    return state.recipes.find((recipe) => recipe.id === id);
  },

  isAuthenticated(state) {
    return state.token != null;
  },

  userId(state) {
    return state.userData.userId;
  },

  userEmail(state) {
    return state.userData.email;
  },
};

export const mutations = {
  addNewRecipe(state, payload) {
    return state.recipes.push(payload);
  },

  setRecipe(state, payload) {
    state.recipes = payload;
  },

  setToken(state, payload) {
    state.token = payload;
  },

  setUserData(state, payload) {
    state.userData = payload;
  },

  deleteRecipe(state, payload) {
    const recipes = state.recipes.filter((item) => item.id !== payload);
    state.recipes = recipes;
  },
};

export const actions = {
  // ---------------------------------------------------------------------------------------------------
  // nuxtServerInit diganti jadi getRecipe
  // ---------------------------------------------------------------------------------------------------
  nuxtServerInit({ commit }) {
    return axios
      .get(
        "https://recall-nuxtjs-theory-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json"
      )
      .then((response) => {
        const recipeArray = [];
        for (const key in response.data) {
          recipeArray.push({ ...response.data[key], id: key });
        }
        commit("setRecipe", recipeArray);
      })
      .catch((e) => context.error(e));
  },
  // ---------------------------------------------------------------------------------------------------

  addRecipe({ commit, state }, recipe) {
    return axios
      .post(
        `https://recall-nuxtjs-theory-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json?auth=${state.token}`,
        {
          ...recipe,
          userId: state.userData.userId,
          username: state.userData.username,
          dataLikes: ["null"],
        }
      )
      .then((response) => {
        commit("addNewRecipe", {
          ...recipe,
          userId: state.userData.userId,
          username: state.userData.username,
          id: response.data.name,
          dataLikes: ["null"],
        });
      });
  },

  authenticateUser({ commit }, authData) {
    let webAPIKey = "AIzaSyBV4Aw9RePLtyl3AIj43sPs6etE6ktnivU";
    let authUrl = authData.isLogin
      ? "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
      : "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";

    return axios
      .post(authUrl + webAPIKey, {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true,
        displayName: authData.displayName,
      })
      .then((response) => {
        commit("setToken", response.data.idToken);
        commit("setUserData", {
          username: response.data.displayName,
          userId: response.data.localId,
          email: response.data.email,
        });

        // Menyimpan Token pada localStorage dan Cookies
        localStorage.setItem("token", response.data.idToken);
        Cookie.set("jwt", response.data.idToken);
        // Menyimpan data expires pada local storage dan cookie
        localStorage.setItem(
          "tokenExpiration",
          new Date().getTime() + Number.parseInt(response.data.expiresIn) * 1000
        );
        Cookie.set(
          "expirationDate",
          new Date().getTime() + Number.parseInt(response.data.expiresIn) * 1000
        );

        const userData = {
          username: response.data.displayName,
          userId: response.data.localId,
          email: response.data.email,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        Cookie.set("acc_user", JSON.stringify(userData));
      })
      .catch((error) => console.log(error));
  },

  initAuth({ commit, dispatch }, req) {
    let user;
    let token;
    let expirationDate;

    if (req) {
      if (!req.headers.cookie) {
        return;
      }

      const jwtCookie = req.headers.cookie
        .split(";")
        .find((c) => c.trim().startsWith("jwt="));
      const accUserCookie = req.headers.cookie
        .split(";")
        .find((c) => c.trim().startsWith("acc_user="));
      console.log(accUserCookie);
      const userCookie = accUserCookie.substr(accUserCookie.indexOf("=") + 1);
      user = JSON.parse(decodeURIComponent(userCookie));

      if (!jwtCookie) {
        return;
      }
      token = jwtCookie.split("=")[1];
      expirationDate = req.headers.cookie
        .split(";")
        .find((c) => c.trim().startsWith("expirationDate="))
        .split("=")[1];
    } else {
      token = localStorage.getItem("token");
      user = JSON.parse(localStorage.getItem("user"));
      expirationDate = localStorage.getItem("tokenExpiration");
    }

    if (new Date().getTime() > +expirationDate || !token) {
      console.log("No token or invalid token");
      dispatch("logout");
      return;
    }

    commit("setToken", token);
    commit("setUserData", user);
  },

  logout({ commit }) {
    commit("setToken", null);
    Cookie.remove("jwt");
    Cookie.remove("acc_user");
    if (process.client) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  likeUpdate({ commit, state, dispatch }, recipe) {
    return axios
      .put(
        `https://recall-nuxtjs-theory-default-rtdb.asia-southeast1.firebasedatabase.app/recipes/${recipe.recipeId}.json?auth=${state.token}`,
        recipe.newDataRecipe
      )
      .then((res) => dispatch("getRecipe"));
  },

  getRecipe({ commit }) {
    return axios
      .get(
        "https://recall-nuxtjs-theory-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json"
      )
      .then((response) => {
        const recipeArray = [];
        for (const key in response.data) {
          recipeArray.push({ ...response.data[key], id: key });
        }
        commit("setRecipe", recipeArray);
      })
      .catch((e) => context.error(e));
  },

  deleteRecipe({ commit, state }, recipeId) {
    return axios
      .delete(
        "https://recall-nuxtjs-theory-default-rtdb.asia-southeast1.firebasedatabase.app/recipes/" +
          recipeId +
          ".json?auth=" +
          state.token
      )
      .then((res) => commit("deleteRecipe"), recipeId);
  },
};
