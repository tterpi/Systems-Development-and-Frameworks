<template>
	<div>
        <Login/>
		<ul>
			<ListItem
				v-for="(item) in pets"
				v-bind:pet="item"
				v-bind:key="item.id"
				v-on:delete-pet="deletePet(item.id)"
				v-on:save-pet="savePet({index: item.id, message: $event})"
                v-on:create-pet="createPet($event)"
			/>
		</ul>
		<CreatePet
            v-on:pet-created="refetch"
        />
	</div>
</template>

<script>
import ListItem from './ListItem.vue'
import Login from './Login.vue'
import CreatePet from './CreatePet.vue'
import gql from 'graphql-tag'

export default {
    components: { ListItem, Login, CreatePet },
    methods: {
        refetch: function(){
            this.$apollo.queries.pets.refetch()
        },
        savePet: async function (pet) {
            await this.$apollo.mutate(
                {
                    mutation: gql`
                    mutation updatePet($id: ID!, $message: String){
                        updatePet(id:$id, message:$message){
                            id
                            message
                        }
                    }
                `,
                variables: {
                    id: pet.index,
                    message: pet.message
                }
                }
            )
            //this.pets[pet.index].message = pet.message;
        },
        deletePet: async function (index) {
            await this.$apollo.mutate({
                mutation: gql`
                mutation deletePet($id: ID!){
                    deletePet(id: $id){
                        id
                        message
                    }
                }
                `,
                variables: {
                    id: index
                }
            })
            this.$apollo.queries.pets.refetch()
            //this.pets.splice(index, 1);
        },
        getNextId: function () {
            return this.nextId++;
        }
    },
    created: function () {
        if (this.nextId === null) {
            this.nextId = this.pets.length + 1;
        }
    },
    apollo: {
        pets: {
            query: gql`
            query PetsQuery($owner: ID, $first: Int, $offset: Int){
                pets(owner: $owner, first: $first, offset: $offset){
                    id
                    message
                    owner{
                        id
                        name
                    }
                }
            }
            `,
            variables: {
                first: 25,
                offset: 0
            }
        }
    },
    data: function () {
        return {
            pets: [],
            nextId: null,
        }
    },
}
</script>

