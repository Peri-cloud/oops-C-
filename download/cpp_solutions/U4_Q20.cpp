#include <iostream>
using namespace std;
struct TrieNode {
    TrieNode *child[26];
    bool end;
    TrieNode() {
        for (int i = 0; i < 26; i++)
            child[i] = NULL;
        end = false;
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
    p->end = true;
}
bool search(TrieNode *root, const char *s) {
    TrieNode *p = root;
    for (int i = 0; s[i] != '\0'; i++) {
        int idx = s[i] - 'a';
        if (p->child[idx] == NULL)
            return false;
        p = p->child[idx];
    }
    return p->end;
}
int main() {
    TrieNode *root = new TrieNode();
    insert(root, "ear");
    insert(root, "ear");
    cout << search(root, "ear") << search(root, "ea") << search(root, "dog");
    return 0;
}
