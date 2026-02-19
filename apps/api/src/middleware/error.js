export function errorHandler(err, req, res, next){
console.erorr(err);
	res.status(500).json({ error: "Internal Server Error" });
}
