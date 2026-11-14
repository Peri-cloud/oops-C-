#include <iostream>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    int adj[20][20];
    int indeg[20];
    for (int i = 0; i < n; i++) {
        indeg[i] = 0;
        for (int j = 0; j < n; j++) {
            adj[i][j] = 0;
        }
    }
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        if (adj[a][b] == 0) {
            adj[a][b] = 1;
            indeg[b] = indeg[b] + 1;
        }
    }
    bool done[20];
    for (int i = 0; i < n; i++) {
        done[i] = false;
    }
    int taken = 0;
    int semesters = 0;
    while (taken < n) {
        int batch[20];
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (!done[i] && indeg[i] == 0) {
                batch[count] = i;
                count = count + 1;
            }
        }
        if (count == 0) {
            cout << "Impossible: Cycle in prerequisites" << endl;
            return 0;
        }
        for (int k = 0; k < count; k++) {
            int u = batch[k];
            done[u] = true;
            taken = taken + 1;
            for (int j = 0; j < n; j++) {
                if (adj[u][j] == 1) {
                    indeg[j] = indeg[j] - 1;
                }
            }
        }
        semesters = semesters + 1;
    }
    cout << "Semesters: " << semesters << endl;
    return 0;
}
