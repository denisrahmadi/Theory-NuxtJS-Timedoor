<template>
  <div>
    <div class="d-flex">
      <nuxt-link
        tag="div"
        :to="{ name: 'recipe-recipeId', params: { recipeId: recipe.id } }"
        class="w-100"
      >
        <div class="card">
          <img
            class="recipes-content__img card-img-top rounded"
            :alt="recipe.recipeTitle"
            :src="recipe.recipeImage"
          />
          <div class="card-body">
            <p class="username">{{ recipe.username }}</p>
            <nuxt-link
              tag="h1"
              :to="{ name: 'recipe-recipeId', params: { recipeId: recipe.id } }"
              class="card-text fs-5 text"
              style="height: 45px; align-item: center"
            >
              {{ recipe.recipeTitle }}
            </nuxt-link>
            <div
              class="recipes-content__body__review card-footer bg-transparent row"
            >
              <div class="col-2">
                <img :src="likeImage" alt="Heart" @click="likeClick" />
              </div>
              <div class="col-6">
                <p>{{ likeCount }} likes</p>
              </div>
              <div class="col-2" v-show="isUser">
                <img
                  src="../../static/images/delete.png"
                  alt="delete"
                  @click="deleteRecipe"
                />
              </div>
              <div class="col-2" v-show="isUser">
                <img
                  src="../../static/images/edit.png"
                  alt="edit"
                  @click="editRecipe"
                />
              </div>
            </div>
          </div>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>
<script>
export default {
  // props: ["recipe"],
  props: {
    recipe: {
      type: Object,
      default: "",
    },
    isUser: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    likeClick() {
      if (!this.$store.getters.isAuthenticated) {
        this.$router.push("/user/login");
      }

      const userEmail = this.$store.getters.userEmail;
      const recipe = this.recipe;
      if (recipe.dataLikes.length === 1 && recipe.dataLikes[0] === "null") {
        recipe.dataLikes[0] = userEmail;
      } else {
        const checkLike = recipe.dataLikes.filter((item) => item === userEmail);
        if (checkLike.length === 0) {
          recipe.dataLikes.push(userEmail);
        } else {
          if (recipe.dataLikes.length === 1) {
            recipe.dataLikes[0] = "null";
          } else {
            const userEmailIndex = recipe.dataLikes.findIndex(
              (item) => item === userEmail
            );
            recipe.dataLikes.splice(userEmailIndex, 1);
          }
        }
      }
      let { id: _, ...newRecipe } = recipe;
      this.$store.dispatch("likeUpdate", {
        recipeId: this.recipe.id,
        newDataRecipe: newRecipe,
      });
    },
    deleteRecipe() {
      this.$store.dispatch("deleteRecipe", this.recipe.id);
    },
  },

  computed: {
    likeCount() {
      if (this.recipe.dataLikes.length === 1) {
        if (this.recipe.dataLikes[0] === "null") {
          return 0;
        }
        return 1;
      }
      return this.recipe.dataLikes.length;
    },
    likeImage() {
      const userEmail = this.$store.getters.userEmail;
      const checkLike = this.recipe.dataLikes.filter(
        (item) => item === userEmail
      );
      if (checkLike.length === 0) {
        return "images/heart-black.png";
      }
      return "images/heart-red.png";
    },
  },
};
</script>
<style scoped>
.username {
  margin-bottom: 0px;
}

body {
  margin: 0px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 40px;
  padding-right: 40px;
  background-color: #eef2e6;
}

main {
  margin: 22px;
}

.recipes {
  display: flex;
  flex-wrap: wrap;
}

.header-nav__link {
  margin-left: 20px;
  color: black;
  text-decoration: none;
  font-size: 20px;
}

/* Recipe Content */

.recipes-content__img {
  width: 200px;
  height: 25vh;
}

.recipes-content__body__review {
  display: flex;
  align-items: center;
}

.recipes-content__body__review img {
  width: 20px;
  height: 20px;
  margin: 5px 10px 5px 0px;
}

.recipes-content__body__review p {
  margin: 0px;
}

.recipes-content__body__review img:hover {
  cursor: pointer;
}

.recipes-content__body__title {
  margin: 5px 0px;
}

/* Add Recipe */
.add-recipe__title,
.add-recipe__desc {
  display: block;
  width: 100%;
  margin: 10px 0px;
  border: none;
}

.add-recipe__title {
  height: 50px;
  font-size: 25px;
}

.add-recipe__desc {
  height: 300px;
}

.add-recipe__img {
  border: none;
  height: 30px;
}

.add-recipe__button {
  color: white;
  background-color: #4b56d2;
  border: none;
  padding: 20px;
  border-radius: 15px;
  font-weight: bold;
}

.add-recipe__button:hover {
  cursor: pointer;
  background-color: #82c3ec;
  color: #4b56d2;
}

/* Detail */
.recipes-detail {
  display: flex;
  justify-content: center;
}

.recipes-detail div {
  width: 600px;
}

.recipes-detail__img {
  width: 400px;
  height: 300px;
  display: block;
  text-align: center;
  margin: 0px auto;
}

.recipes-detail__title {
  text-align: center;
}
</style>
