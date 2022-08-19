<script lang="ts">
	import Chart from 'svelte-frappe-charts';

	export let data: any;

	interface Character {
		name: string;
		link: string;
		state: 'aktiv' | 'inaktiv';
		age: string;
		class: string;
		race: string;
		sex: 'm' | 'f' | 'unknown';
		lastseen: string;
	}

	let chars = new Map<string, Character>();

	// console.log(data);
	for (const char of data.data) {
		chars.set(char[0], char[1]);
	}

	const allraces = new Set();
	const allclasses = new Set();

	chars.forEach((char) => {
		allraces.add(char.race);
		allclasses.add(char.class);
	});

	let races = new Map<string, number>();
	let classes = new Map<string, number>();
	let sexes = new Map<string, number>();
	let active = new Map<string, number>();

	let classdata = {};
	let racedata = {};
	let activedata = {};
	let sexdata = {};

	let racefilter = 'all';
	let classfilter = 'all';
	let sexfilter = 'all';
	let activefilter = 'all';
	let sum = 0;

	$: {
		sum = 0;
		races = new Map<string, number>();
		classes = new Map<string, number>();
		sexes = new Map<string, number>();
		active = new Map<string, number>();

		chars.forEach((char) => {
			if (racefilter !== 'all' && char.race !== racefilter) return;
			if (classfilter !== 'all' && char.class !== classfilter) return;
			if (sexfilter !== 'all' && char.sex !== sexfilter) return;
			if (activefilter !== 'all' && char.state !== activefilter) return;
			sum++;

			const currentrace = races.get(char.race) || 0;
			races.set(char.race, currentrace + 1);

			const currentclass = classes.get(char.class) || 0;
			classes.set(char.class, currentclass + 1);

			const currentsex = sexes.get(char.sex) || 0;
			sexes.set(char.sex, currentsex + 1);

			const currentactive = active.get(char.state) || 0;
			active.set(char.state, currentactive + 1);
		});

		classdata = {
			labels: [...classes.keys()],
			datasets: [
				{
					values: [...classes.values()]
				}
			]
		};

		racedata = {
			labels: [...races.keys()],
			datasets: [
				{
					values: [...races.values()]
				}
			]
		};

		sexdata = {
			labels: [...sexes.keys()].map((key) => {
				switch (key) {
					case 'f':
						return 'Frau';
					case 'm':
						return 'Mann';
					default:
						return 'Unbekannt';
				}
			}),
			datasets: [
				{
					values: [...sexes.values()]
				}
			]
		};

		activedata = {
			labels: [...active.keys()],
			datasets: [
				{
					values: [...active.values()]
				}
			]
		};
	}
</script>

<h1>Alatair-Stats</h1>

<div class="filters">
	<div class="filter">
		Rasse:
		<select bind:value={racefilter}>
			<option value="all">Alle</option>
			{#each [...allraces.keys()] as race}
				<option value={race}>{race}</option>
			{/each}
		</select>
	</div>

	<div class="filter">
		Klasse:
		<select bind:value={classfilter}>
			<option value="all">Alle</option>
			{#each [...allclasses.keys()] as race}
				<option value={race}>{race}</option>
			{/each}
		</select>
	</div>

	<div class="filter">
		Geschlecht:
		<select bind:value={sexfilter}>
			<option value="all">Alle</option>
			<option value="m">Männlich</option>
			<option value="m">Weiblich</option>
			<option value="m">Unbekannt</option>
		</select>
	</div>

	<div class="filter">
		Status:
		<select bind:value={activefilter}>
			<option value="all">Alle</option>
			<option value="aktiv">aktiv</option>
			<option value="abwesend">abwesend</option>
		</select>
	</div>
</div>

<div class="sexnstate">
	<div>
		<Chart data={sexdata} type="pie" title="Geschlecht" />
	</div>

	<div>
		<Chart data={activedata} type="pie" title="Aktivität" />
	</div>

	<div>
		<Chart data={racedata} type="pie" title="Rassenverteilung" maxSlices="7" />
	</div>
</div>

<div class="classes">
	<div>
		<Chart data={classdata} type="bar" barOptions={{ spaceRatio: 0.2 }} title="Klassenverteilung" />
	</div>
</div>

<style lang="scss">
	.sexnstate {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;

		@media screen and (max-width: 900px) {
			grid-template-columns: 1fr;
		}
	}
</style>
