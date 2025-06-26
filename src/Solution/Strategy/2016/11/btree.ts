export interface BTreeKeyInterface<K, V> {
    getKey(): K;
    getValue(): V;
}

export interface BTreeSerializableInterface<K, V> {
    t: number;
    root: BTreeNodeSerializableInterface<K, V>;
}
export interface BTreeNodeSerializableInterface<K, V> {
    isLeaf: boolean;
    keys: BTreeKeyInterface<K, V>[];
    children: BTreeNodeSerializableInterface<K, V>[];
}
export interface BTreeNodeInterface<K, V> {
    findIndex(key: BTreeKeyInterface<K, V>): number;
    toJSON(): BTreeNodeSerializableInterface<K, V>;
}

export interface BTreeInterface<K, V> {
    search(
        node: BTreeNodeInterface<K, V>,
        key: BTreeKeyInterface<K, V>
    ): boolean;
    contains(key: BTreeKeyInterface<K, V>): boolean;
    insert(key: BTreeKeyInterface<K, V>): void;
    searchAndFetch(
        node: BTreeNodeInterface<K, V>,
        key: BTreeKeyInterface<K, V>
    ): BTreeKeyInterface<K, V> | undefined;
    fetch(key: BTreeKeyInterface<K, V>): BTreeKeyInterface<K, V> | undefined;
    toJSON(): BTreeSerializableInterface<K, V>;
}

export class BTreeNode<K, V>
    implements BTreeNodeInterface<K, V>, BTreeNodeSerializableInterface<K, V>
{
    public isLeaf: boolean;
    public keys: BTreeKeyInterface<K, V>[];
    public children: BTreeNode<K, V>[];
    constructor(isLeaf = false) {
        this.isLeaf = isLeaf;
        this.keys = [];
        this.children = [];
    }

    findIndex(key: BTreeKeyInterface<K, V>) {
        let i = 0;
        while (i < this.keys.length && key.getKey() > this.keys[i].getKey()) {
            i++;
        }
        return i;
    }

    toJSON(): BTreeNodeSerializableInterface<K, V> {
        return {
            isLeaf: this.isLeaf,
            keys: this.keys,
            children: this.children.map((child) => child.toJSON()),
        };
    }

    static fromJSON<K, V>(json: BTreeNodeSerializableInterface<K, V>) {
        const node = new BTreeNode<K, V>(json.isLeaf);
        node.keys = json.keys;
        node.children = json.children.map(BTreeNode.fromJSON<K, V>);
        return node;
    }
}

export class BTree<K, V>
    implements BTreeInterface<K, V>, BTreeSerializableInterface<K, V>
{
    public t: number;
    public root: BTreeNode<K, V>;
    constructor(t = 2) {
        this.t = t;
        this.root = new BTreeNode<K, V>(true);
    }

    searchAndFetch(
        node: BTreeNode<K, V>,
        key: BTreeKeyInterface<K, V>
    ): BTreeKeyInterface<K, V> | undefined {
        let i = node.findIndex(key);

        if (i < node.keys.length && node.keys[i].getKey() === key.getKey()) {
            return node.keys[i];
        }

        if (node.isLeaf) {
            return undefined;
        }

        return this.searchAndFetch(node.children[i], key);
    }

    fetch(key: BTreeKeyInterface<K, V>): BTreeKeyInterface<K, V> | undefined {
        return this.searchAndFetch(this.root, key);
    }

    search(node: BTreeNode<K, V>, key: BTreeKeyInterface<K, V>): boolean {
        let i = node.findIndex(key);

        if (i < node.keys.length && node.keys[i].getKey() === key.getKey()) {
            return true;
        }

        if (node.isLeaf) {
            return false;
        }

        return this.search(node.children[i], key);
    }

    contains(key: BTreeKeyInterface<K, V>) {
        return this.search(this.root, key);
    }

    insert(key: BTreeKeyInterface<K, V>) {
        const root = this.root;
        if (root.keys.length === 2 * this.t - 1) {
            const newRoot = new BTreeNode<K, V>(false);
            newRoot.children.push(root);
            this.splitChild(newRoot, 0);
            this.insertNonFull(newRoot, key);
            this.root = newRoot;
        } else {
            this.insertNonFull(root, key);
        }
    }

    private insertNonFull(node: BTreeNode<K, V>, key: BTreeKeyInterface<K, V>) {
        let i = node.keys.length - 1;

        if (node.isLeaf) {
            while (i >= 0 && key.getKey() < node.keys[i].getKey()) {
                i--;
            }
            node.keys.splice(i + 1, 0, key);
        } else {
            while (i >= 0 && key.getKey() < node.keys[i].getKey()) {
                i--;
            }
            i++;

            if (node.children[i].keys.length === 2 * this.t - 1) {
                this.splitChild(node, i);
                if (key.getKey() > node.keys[i].getKey()) {
                    i++;
                }
            }
            this.insertNonFull(node.children[i], key);
        }
    }

    private splitChild(parent: BTreeNode<K, V>, i: number) {
        const fullChild = parent.children[i];
        const newChild = new BTreeNode<K, V>(fullChild.isLeaf);
        const t = this.t;

        newChild.keys = fullChild.keys.splice(t);
        const midKey = fullChild.keys.pop();
        if (undefined === midKey) {
            return;
        }

        if (!fullChild.isLeaf) {
            newChild.children = fullChild.children.splice(t);
        }

        parent.children.splice(i + 1, 0, newChild);
        parent.keys.splice(i, 0, midKey);
    }

    toJSON() {
        return {
            t: this.t,
            root: this.root.toJSON(),
        };
    }

    static fromJSON<K, V>(json: BTreeSerializableInterface<K, V>) {
        const tree = new BTree<K, V>(json.t);
        tree.root = BTreeNode.fromJSON<K, V>(json.root);
        return tree;
    }
}
