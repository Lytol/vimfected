import Client from '../utils/Client';
import { Command, CommandType } from '../utils/Commands';
import { v4 as uuid } from 'uuid';

export default class Menu extends Phaser.Scene {
    client: Client;

    constructor() {
        super('menu');
    }

    preload() {
        // Setup client
        this.client = new Client("ws://localhost:3000/", uuid());
    }

    create() {
        const { centerX, centerY } = this.cameras.main;
        this.add.text(centerX, centerY, "vimfected").setOrigin(0.5, 0.5);
    }

    update() {
        const snapshot = this.client.get(CommandType.Snapshot);
        if (snapshot) {
            this.scene.start("game", {
                client: this.client,
                map: snapshot.data.map,
            })
        }
    }
}