#include <iostream>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    int eu[105], ev[105], ew[105];
    for (int i = 0; i < m; i++) {
        cin >> eu[i] >> ev[i] >> ew[i];
    }
    int dist[20];
    for (int i = 0; i < n; i++) {
        dist[i] = 1000000000;
    }
    dist[0] = 0;
    for (int pass = 1; pass < n; pass++) {
        for (int i = 0; i < m; i++) {
            if (dist[eu[i]] != 1000000000 && dist[eu[i]] + ew[i] < dist[ev[i]]) {
                dist[ev[i]] = dist[eu[i]] + ew[i];
            }
        }
    }
    for (int i = 0; i < m; i++) {
        if (dist[eu[i]] != 1000000000 && dist[eu[i]] + ew[i] < dist[ev[i]]) {
            cout << "Negative Cycle" << endl;
            return 0;
        }
    }
    if (dist[n - 1] == 1000000000) {
        cout << "No Route" << endl;
    } else {
        cout << "Minimum Cost: " << dist[n - 1] << endl;
    }
    return 0;
}
