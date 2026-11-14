#include <iostream>
using namespace std;
int nodes = 0;
struct TrieNode {
    TrieNode *child[26];
    TrieNode() {
        for (int i = 0; i < 26; i++)
            child[i] = NULL;
        nodes++;
    }
};
void insert(TrieNode *root, const char *s) {
    TrieNode *p = root;
    for (int i = 0; s[i] != '\0'; i++) {
        int idx = s[i] - 'a';
        if (p->child[idx] == NULL)
            p->child[idx] = new TrieNode();
        p = p->child[idx];
    }
}
int main() {
    TrieNode *root = new TrieNode();
    insert(root, "to");
    insert(root, "tea");
    insert(root, "ten");
    cout << nodes;
    return 0;
}
