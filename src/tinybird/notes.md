> run `tb build` before deploying schema changes with ` tb --cloud deploy`

## When doing a total schema redesign run

```bash
tb --cloud deploy --allow-destructive-operations
```

and add to the schema file something like

```sql
FORWARD_QUERY >
  SELECT
    defaultValueOfTypeName('String') AS search_id,
    search_query,
    user_id,
    timestamp,
    defaultValueOfTypeName('Array(Tuple(Int32,String))') AS shown_results,
    defaultValueOfTypeName('LowCardinality(String)') AS device_type,
    defaultValueOfTypeName('LowCardinality(String)') AS browser_name,
    defaultValueOfTypeName('String') AS browser_version,
    defaultValueOfTypeName('LowCardinality(String)') AS os_name,
    location
```
