<template>
  <div>
    <RecipeList 
      :dataRecipes="recipes"
      :isUser="true" 
    />
  </div>
</template>

<script>
import RecipeList from "../../components/recipe/RecipeList.vue";
export default {
  middleware: ["check-auth", "auth"],
  components: {
    RecipeList
  },
  computed: {
    recipes() {
      const userId = this.$store.getters.userId;
      const recipes = this.$store.getters.recipeData;
      return recipes.filter((recipe) => recipe.userId === userId);
    },
  },
};
</script>
