<template>
	<div>
        <input placeholder="message" v-model="message"/>
        <select v-model="owner">
            <option disabled value="">owner</option>
            <option v-for="(person) in owners" v-bind:key="person.id" v-bind:value="person.id">
                {{ person.name }}
            </option>
        </select>
		<button class="saveButton" v-on:click="createPet">create pet</button>
	</div>
</template>

<script>
import gql from 'graphql-tag'

export default{
	props : [],
	data: function (){
		return {
			message: "",
			owner: ""
		}
	},
	methods: {
		createPet: async function (){
            if(!this.message || !this.owner){
                return
            }
            await this.$apollo.mutate({
                mutation:gql`
                mutation createPet($message: String, $owner: ID!){
                    createPet(message: $message, owner: $owner){
                        message
                        owner{
                            name
                        }
                    }
                }
                `,
                variables:{
                    message: this.message,
                    owner: this.owner
                }
            })
            this.$emit('pet-created');
            this.message = ""
            this.owner = ""
            //this.$apollo.queries.pets.refetch()
        }
    },
    apollo: {
        owners: {
            query: gql`{
                owners{
                    id
                    name
                }
            }
            `
        }
    }
}
</script>