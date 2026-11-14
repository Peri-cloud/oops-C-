#include <iostream>
#include <string>
using namespace std;
struct TrieNode {
    TrieNode* children[26];
    int count;
};
TrieNode* createNode() {
    TrieNode* node = new TrieNode;
    for (int i = 0; i < 26; i++) {
        node->children[i] = NULL;
    }
    node->count = 0;
    return node;
}
int main() {
    int n, q;
    cin >> n;
    TrieNode* root = createNode();
    for (int i = 0; i < n; i++) {
        string word;
        cin >> word;
        TrieNode* temp = root;
        for (int j = 0; j < word.length(); j++) {
            int index = word[j] - 'a';
            if (temp->children[index] == NULL) {
                temp->children[index] = createNode();
            }
            temp = temp->children[index];
            temp->count = temp->count + 1;
        }
    }
    cin >> q;
    for (int i = 0; i < q; i++) {
        string prefix;
        cin >> prefix;
        TrieNode* temp = root;
        int result = 0;
        bool found = true;
        for (int j = 0; j < prefix.length(); j++) {
            int index = prefix[j] - 'a';
            if (temp->children[index] == NULL) {
                found = false;
                break;
            }
            temp = temp->children[index];
        }
        if (found) {
            result = temp->count;
        }
        cout << prefix << ": " << result << endl;
    }
    return 0;
}
