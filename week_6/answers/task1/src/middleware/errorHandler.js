export function HandleNotFound(req, res, next) {
  res.status(404).json({ error: "Route not found" });
}

export function HandleError(err, req, res, next) {
  console.error("Server error:", err.stack);
  res.status(500).json({ error: "Internal server error" });
}
