import sqlite3
import sys

def run_query(query):
    try:
        conn = sqlite3.connect('hospital.db')
        cursor = conn.cursor()
        cursor.execute(query)
        
        # If it's a SELECT query, show results
        if query.lower().strip().startswith('select'):
            rows = cursor.fetchall()
            if not cursor.description:
                print("Query executed successfully.")
                return
                
            colnames = [description[0] for description in cursor.description]
            
            print("\n" + "="*80)
            print(f" SQL RESULTS ")
            print("="*80)
            
            if not rows:
                print("No data found in table.")
            else:
                # Calculate column widths for better alignment
                widths = [len(str(name)) for name in colnames]
                for row in rows:
                    for i, val in enumerate(row):
                        widths[i] = max(widths[i], len(str(val)))
                
                # Print Header
                header = " | ".join(str(colnames[i]).ljust(widths[i]) for i in range(len(colnames)))
                print(header)
                print("-" * len(header))
                
                # Print Rows
                for row in rows:
                    print(" | ".join(str(row[i]).ljust(widths[i]) for i in range(len(row))))
            
            print("="*80 + "\n")
        else:
            conn.commit()
            print(f"\n[SUCCESS] {cursor.rowcount} row(s) affected.\n")
            
        conn.close()
    except Exception as e:
        print(f"\n[ERROR] {e}\n")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("\nUsage: python query.py \"YOUR SQL QUERY HERE\"")
        print("Example: python query.py \"SELECT * FROM billing\"\n")
    else:
        run_query(sys.argv[1])
