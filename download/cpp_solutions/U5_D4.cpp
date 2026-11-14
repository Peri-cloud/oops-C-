#include <iostream>
#include <string>
using namespace std;
int graph[20][20];
void addEdge(int u, int v, int w) {
    graph[u][v] = w;
    graph[v][u] = w;
}
int primMST(int n) {
    bool inTree[20];
    int key[20];
    for (int i = 0; i < n; i++) {
        key[i] = 1000000000;
        inTree[i] = false;
    }
    key[0] = 0;
    int total = 0;
    for (int count = 0; count < n; count++) {
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!inTree[v] && (u == -1 || key[v] < key[u])) {
                u = v;
            }
        }
        inTree[u] = true;
        total = total + key[u];
        for (int v = 0; v < n; v++) {
            if (graph[u][v] > 0 && !inTree[v] && graph[u][v] < key[v]) {
                key[v] = graph[u][v];
            }
        }
    }
    return total;
}
int main() {
    int n, m;
    cin >> n >> m;
    for (int i = 0; i < m; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        addEdge(u, v, w);
    }
    cout << "MST Weight: " << primMST(n) << endl;
    return 0;
}
