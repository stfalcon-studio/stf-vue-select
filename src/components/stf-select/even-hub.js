class EventHub {
    constructor () {
        this.eventsCollection = {};
    }

    $emit(name, event) {
        if (this.eventsCollection[name] && this.eventsCollection[name][0]) {
            for (let callback of this.eventsCollection[name]) {
                setTimeout(() => callback(event), 0);
            }
        }
    }

    $on(name, callback) {
        if (typeof callback === 'function') {
            if (!this.eventsCollection[name]) {
                this.eventsCollection[name] = [];
            }

            if (this.eventsCollection[name].indexOf(this.eventsCollection[name]) === -1) {
                this.eventsCollection[name].push(callback);
            } else {
                throw new ArgumentExceptions(`Callback can not be used twice`); 
            }
        } else {
            throw new ArgumentExceptions(`Callback can not be ${typeof callback} event ${name}`); 
        }
    }

    $off(name, callback) {
        if (typeof callback === 'function') {
            if (!this.eventsCollection[name]) {
                throw new ArgumentExceptions(`You don't have callback on ${name} event ${name}`); 
            }

            const index = this.eventsCollection[name].indexOf(callback);
            this.eventsCollection[name].splice(index, 1);
        } else {
            throw new ArgumentExceptions(`Callback can not be ${typeof callback} event ${name}`); 
        }
    }
}

function ArgumentExceptions(message) {
    this.message = message;
    this.name = "Argument exception";
}

export const eventHub = new EventHub();
