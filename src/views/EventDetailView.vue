<script setup>
	import { onMounted, ref, watch } from 'vue';
	import Service from '../service';
	import { useStore } from 'vuex';
	import { useRoute, useRouter } from 'vue-router';
	const eventDetails = ref([]);
	const categoryId = ref();

	const categoryList = ref([]);

	const route = useRoute();
	const router = useRouter();
	const store = useStore();

	const updateEventState = (key, value) => {
		store.commit('update', [key, value]);
	};

	const findPrice = async () => {
		const category = categoryList.value.find((x) => x.id == categoryId.value);
		updateEventState('price', category.price);
		updateEventState('eventCategoryId', categoryId.value);
	};

	const handeSeatPlan = () => {
		if (categoryId.value) {
			router.push(`/event-detail/${route?.params?.id}/${categoryId.value}`);
		} else {
			console.log('select a  category');
		}
	};
	onMounted(() => {
		Service.getEventDetailPage(route?.params?.id)
			.then((res) => {
				eventDetails.value = res?.data?.data;
				categoryList.value = res?.data?.data?.event_categories;
			})
			.catch((error) => console.log(error));
	});
</script>

<template>
	<div class="mx-2">
		<div>
			<p class="my-2">{{ eventDetails?.title }}</p>
		</div>

		<p class="mb-4">{{ eventDetails?.description }}</p>
		<div><img :src="eventDetails?.image_url" alt="" class="" /></div>

		<div class="flex flex-col mx-2 w-1/3">
			<label class="my-2" for="category">Select a category</label>

			<select
				name="category"
				id=""
				v-model="categoryId"
				placeholder="Please choose an option"
				@change="findPrice()"
			>
				<option v-for="item in eventDetails?.event_categories" :value="item.id">
					{{ item.name }} -- {{ item.price }} TL
				</option>
			</select>
		</div>

		<div>
			<button
				@click="handeSeatPlan"
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-3"
			>
				Go to seat plan
			</button>
		</div>
	</div>
</template>

<style></style>
