<template>
	<div>
        <input placeholder="username" v-model="userName"/>
        <input placeholder="password" type="password" v-model="password"/>
		<button class="saveButton" v-on:click="login">login</button>
	</div>
</template>

<script>
import { onLogin } from '../vue-apollo'
import gql from 'graphql-tag'

export default{
	props : [],
	data: function (){
		return {
			userName: null,
			password: null
		}
	},
	methods: {
		login: async function(){
			const token = await this.$apollo.mutate(
                {
                    mutation: gql`
					mutation login($userName: String!, $pwd: String!){
						login(userName: $userName, pwd: $pwd)
					}
					`,
					variables: {
						userName: this.userName,
						pwd: this.password
					}
                }
			)
			
			if(token.data.login){
				onLogin(this.$apollo.getClient(),token.data.login)
			}
		}
	},
}
</script>