import { packages as Packages } from "../account/packages"

var helpers = {
	date: function (date) {
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var days = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

		month = months[date.getMonth()];
		day   = days[date.getDay()];
		dayNumber = date.getDate();
		year = date.getYear() + 1900;

		return day + ", " + month + " " + dayNumber + ", " + year;
	},
	time: function (date) {
		var time = date.toLocaleString('en-US', { hour: 'numeric',minute:'numeric', hour12: true });
		var timezone = date.toTimeString().match(/\((.+)\)/)[1];
		
		return time + " (" + timezone + ")";
	},
	getField: function (userDoc, field, fallback) {
		fallback = fallback || null;

		if (field) {
			field = field.split('.');

			for (var i = 0; i < field.length; i++) {
				if (typeof userDoc[field[i]] == "undefined") {
					return fallback;
				}
				userDoc = userDoc[field[i]];
			}
		}

		return userDoc;
	},
	displayName: function (doc) {
		var self = this;

		var Namer = {
			result: "",
			counter: 0,
			addToResult: function (name) {
				if (counter) this.result = this.result + ", ";
				counter = counter + 1;
				this.result = this.result + name;
			},
			add: function (data) {
				if (typeof data === "object") {
					data.forEach(function (item) {
						Namer.addToResult(item.address)
					})
				}

				if (data && typeof data !== "object") {
					Namer.addToResult(data);	
				}
			}
		}

		Packages.forEach(function (package) {
			if (package.field) {
				targetField = package.field

				if (package.field === "emails.address") {
					targetField = "emails";
				}

				value = self.getField(doc, targetField);

				if (value) {
					Namer.add(value);
				}
			}
		});

		return Namer.result;
	},
	avatar: function (document) {
		var self = this;
		var photo = null;

		Packages.forEach(function (package) {
			if (package.avatar) {
				targetField = package.avatar

				if (package.avatar === "emails.address") {
					targetField = "emails";
				}

				target = self.getField(document, targetField);	
			
				if (target) {
					if (package.avatarLogic) {
						photo = package.avatarLogic(target);
					} else {
						photo = target;
					}
				}
			}
		});

		return photo;
	},
	email: function (data) {
		var emailString = "";
		var number = 0;

		data.forEach(function (email) {
			
			if (number) {
				emailString = emailString + ", ";
			}

			number = number + 1;
			emailString = emailString + email.address;
		});

		return emailString
	}
}

export { helpers }