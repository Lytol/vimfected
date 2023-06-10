import Client from '../utils/Client';
import { CommandType } from '../utils/Commands';
import { v4 as uuid } from 'uuid';

export default class Menu extends Phaser.Scene {
    client: Client;

    constructor() {
        super('menu');
    }

    preload() {
        // Setup client
        // TODO: users should be able to register and sign in
        this.client = new Client("ws://localhost:3000/", uuid());
    }

    create() {
        const { centerX, centerY } = this.cameras.main;
        this.add.text(centerX, centerY, "vimfected").setOrigin(0.5, 0.5);
    }

    update() {
        // Discard messages until we get the snapshot and load game from there
        const cmd = this.client.get(CommandType.Any);
        if (cmd && cmd.type === CommandType.Snapshot) {
            this.scene.start("game", {
                client: this.client,
                snapshot: cmd.data,
            })
        }
    }
}