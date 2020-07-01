const Future = Fluture;

const concatString = R.reduce (R.concat) ("");

const getEndpoint = currencyCode => concatString ([
	"https://free.currconv.com/api/v7/convert?q=",
	currencyCode,
	"_VND&compact=ultra&apiKey=ab07142fb8b095dc7bc5"
]);

const FGetCurrencyRate = currencyCode =>
	// :: (a -> Promise e r) -> a -> Future e r
	Future.encaseP (fetch) (getEndpoint(currencyCode))
		// chain :: ((a -> Promise e r) -> a -> Future e r) -> Future e r -> Future e r
		.pipe(Future.chain (Future.encaseP (res => res.json())))
		// extract the currency rate
		.pipe(Future.map (R.compose (R.head, R.values)))

const FtoConsume = currencyCode => 
	(FGetCurrencyRate (currencyCode)).pipe (Future.fork (console.error) (displayResult));

const displayResult = rate => {
	const amount = parseFloat(document.getElementById("amount").value);
	document.getElementById("result").innerHTML = amount * rate;
}

document.querySelector("button").addEventListener("click", e => {
		e.preventDefault();
		const _rateChosen = document.querySelector(
			"input[name='currency']:checked"
		).value;

		FtoConsume(_rateChosen);
});