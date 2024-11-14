/** @odoo-module **/

export const CURRENT_VERSION = 2.0;

export const migrations = [
    {
        fromVersion: 1.0,
        toVersion: 2.0,
        apply: (state) => {
            state.trees.peachTree = {
                price: 10000,
                level: 4,
                produce: "peach",
                purchased: 0,
            };
            state.fruits.peach = 0;
            return state;
        },
    },
];

export function migrate(state) {
    let newState = state;
    console.log("migrate", newState);
    if (newState?.version < CURRENT_VERSION) {
        for (const migration of migrations) {
            if (newState.version === migration.fromVersion) {
                newState = migration.apply(newState);
                newState.version = migration.toVersion;
            }
        }
    }
    return newState;
}
