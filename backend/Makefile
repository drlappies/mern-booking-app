start-dev: start-mongo
stop-dev: stop-mongo

start-mongo:
	@echo "starting mongo cont. in docker..."

	@docker run -d --name rental-mongo \
		-e MONGO_INITDB_ROOT_USERNAME=user \
		-e MONGO_INITDB_ROOT_PASSWORD=user \
		mongo:5.0.6

stop-mongo:
	@echo "stopping mongo cont. in docker..."

	@docker stop rental-mongo
	@docker rm rental-mongo