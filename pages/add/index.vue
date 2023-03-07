<template>
  <div class="container w-50">
    <div class="row g-3-justify-content-md-center">
      <app-input
        placeholder="Traditional Chicken Fried Rice"
        v-model="newRecipe.recipeTitle"
      >
        <label class="form-control">Recipe Title</label>
      </app-input>
      <app-input
        placeholder="www.imagelink.com/fried-rice.jpg"
        v-model="newRecipe.recipeImage"
      >
        <label class="form-control">Recipe Image</label>
      </app-input>
      <app-text-area 
        v-model="newRecipe.description"
      >
        <label class="form-control">Recipe Description</label>
      </app-text-area>
      <div>
        <div class="col-12">
          <h2>Ingredients</h2>
        </div>
        <div
          class="row g-1 justify-content-md-center"
          style="margin-top: 5px"
          v-for="item in ingredientCount"
          :key="item"
        > 
          <app-input
            colStyle="col-8"
            placeholder="2 large eggs"
            v-model="newRecipe.ingredients[item - 1]"
          ></app-input>
          <app-button
            :buttonType="item !== ingredientCount ? 'delete' : 'add'"
            @click="addIngredient(item)"
          >
            {{ item !== ingredientCount ? "Delete" : "Add" }}
          </app-button>
        </div>
        <div class="col-12">
          <h2>Directions</h2>
        </div>
        <div
          class="row g-1 justify-content-md-center"
          style="margin-top: 5px"
          v-for="item in directionCount"
          :key="item"
        >
          <app-input
            colStyle="col-8"
            :placeholder="`Step ${item}`"
            v-model="newRecipe.directions[item - 1]"
          ></app-input>
          <app-button
            :buttonType="item !== directionCount ? 'delete' : 'add'"
            @click="addDirection(item)"
            >{{ item !== directionCount ? "Delete" : "Add" }}</app-button
          >
        </div>
        <app-button @click="addRecipe">Submit</app-button>
      </div>
    </div>
    {{ newRecipe }}
  </div>
</template>

<script>
import axios from "axios";
import Button from "../../components/newRecipe/Button.vue";
import Input from "../../components/newRecipe/Input.vue";
import TextArea from "../../components/newRecipe/TextArea.vue";

export default {
  components: {
    "app-input": Input,
    "app-button": Button,
    "app-text-area": TextArea,
  },
  data() {
    return {
      newRecipe: {
        id: null,
        recipeImage: "",
        recipeTitle: "",
        ingredients: [],
        directions: [],
        description: ``,
        body: "",
        ingredientCount: 1,
        directionCount: 1,
      },
      ingredientCount: 1,
      directionCount: 1,
    };
  },
  methods: {
    addRecipe() {
      this.$store
        .dispatch("addRecipe", this.newRecipe)
        .then(() => this.$router.push("/"));
    },
    addIngredient(item) {
      if (item === this.ingredientCount) {
        this.ingredientCount += 1;
      } else {
        this.newRecipe.ingredients.splice(item - 1, 1);
        this.ingredientCount -= 1;
      }
    },
    addDirection(item) {
      if (item === this.directionCount) {
        this.directionCount += 1;
      } else {
        this.newRecipe.directions.splice(item - 1, 1);
        this.directionCount -= 1;
      }
    },
  },
  middleware: ["check-auth", "auth"],
};
</script>
<style scoped>
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
.recipes-content {
  background-color: #eef2e6;
  padding: 10px;
  margin: 13px 13px;
}

.recipes-content__body {
  padding: 5px;
}

.recipes-content__img {
  width: 280px;
  height: 210px;
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
