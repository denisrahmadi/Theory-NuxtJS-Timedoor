<template>
  <div>
    <h1 class="title">LOGIN</h1>
    <form @submit.prevent="onSubmit">
      <div class="container">
        <input
          v-model="email"
          type="email"
          placeholder="Enter Email"
          name="uname"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Enter Password"
          name="psw"
          required
        />
        <button type="submit">Log In</button>
        <div style="display: flex;">
            <p>Gapunya akun?</p>
            <nuxt-link
                tag="p"
                to="/user/signup"
                style="cursor: pointer; color: blue;"
            >
                Sign up
            </nuxt-link>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    onSubmit() {
      this.$store
        .dispatch("authenticateUser", {
          isLogin: true,
          email: this.email,
          password: this.password,
        })
        .then(() => {
          this.$router.push("/");
        });
    },
  },
};
</script>
<style>
.title {
  text-align: center;
}
.login {
  text-align: center;
}

input[type="email"],
input[type="password"] {
  width: 20%;
  padding: 12px 20px;
  margin: 8px auto;
  display: block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

button {
  background-color: #04aa6d;
  color: white;
  padding: 14px 20px;
  margin: 8px auto;
  display: block;
  border: none;
  cursor: pointer;
  width: 20%;
}

button:hover {
  opacity: 0.8;
}

.container {
  padding: 16px;
}

span.psw {
  float: right;
  padding-top: 16px;
}
</style>
