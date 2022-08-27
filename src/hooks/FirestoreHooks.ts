import { addDoc, collection, deleteDoc, doc, FirestoreError, getDoc, getDocs, onSnapshot, Query, queryEqual, setDoc, SetOptions, Timestamp, updateDoc } from "firebase/firestore"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { firestore } from "../config/fire"
import UserContext from "../context/UserContext"

export interface Error {
    code: string,
    message: string
}

export type FirestoreDoc<T> = T & {
    id: string
}

export type ErrorTypes = Error | FirestoreError | null

export type UserLog = {
    email?: string | null,
    id: string,
    name?: string | null,
}

/**
 * Fetches document from firestore (get()) using document path
 */
export const useFirestoreDocPathFetch = <T>(docPath: string): [FirestoreDoc<T> | null, ErrorTypes, boolean] => {

    const [docData, setDoc] = useState<null | FirestoreDoc<T>>(null)
    const [error, setError] = useState<ErrorTypes>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        const docRef = doc(firestore, docPath)
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    let doc: FirestoreDoc<T>;
                    let documentFetched = docSnap.data();
                    documentFetched!.id = docSnap.id;
                    doc = documentFetched as FirestoreDoc<T>;
                    setDoc(doc)
                    setError(null)
                } else {
                    setDoc(null)
                    setError({ code: "doc-not-found", message: "No document found." })
                }
            })
            .catch((error) => {
                console.error(error)
                setDoc(null)
                setError(error)
            })
            .finally(() => setLoading(false))

    }, [docPath])

    return [docData, error, loading];
}

/**
 * Listens to document from firestore (onSnapshot()) using document path
 */
export const useFirestoreDocPathListener = <T>(docPath: string): [FirestoreDoc<T> | null, ErrorTypes] => {

    const [docData, setDoc] = useState<null | FirestoreDoc<T>>(null)
    const [error, setError] = useState<ErrorTypes>(null)

    useEffect(() => {

        const docR = doc(firestore, docPath)
        let listener = onSnapshot(docR, (docRef) => {
            if (docRef.exists()) {
                let doc: FirestoreDoc<T>;
                let documentFetched = docRef.data();
                documentFetched!.id = docRef.id;
                doc = documentFetched as FirestoreDoc<T>;
                setDoc(doc)
                setError(null)
            } else {
                setDoc(null)
                setError({ code: "doc-not-found", message: "No document found." })
            }
        }, (error) => {
            console.error(error)
            setDoc(null)
            setError(error)
        })
        return (() => {
            listener();
        })
    }, [docPath])

    return [docData, error];
}

/**
 * Fetches documents from firestore (get()) using collection path
 */
export const useFirestoreCollectionPathFetch = <T>(collectionPath: string): [FirestoreDoc<T>[] | null, ErrorTypes] => {

    const [docs, setDocs] = useState<null | FirestoreDoc<T>[]>(null)
    const [error, setError] = useState<ErrorTypes>(null)

    useEffect(() => {
        const collectionR = collection(firestore, collectionPath)
        getDocs(collectionR)
            .then((querySnapshot) => {
                let documentsFetched: FirestoreDoc<T>[] = []

                querySnapshot.forEach((docRef) => {
                    let doc: FirestoreDoc<T>;
                    let data = docRef.data();
                    data.id = docRef.id;
                    doc = data as FirestoreDoc<T>;
                    documentsFetched.push(doc)
                })
                setDocs(documentsFetched)
                setError(null)

            })
            .catch((error) => {
                console.error(error)
                setDocs(null)
                setError(error)
            })
    }, [collectionPath])

    return [docs, error];
}

/**
 * Listens to documents from firestore (onSnapshot()) using collection path
 */
export const useFirestoreCollectionPathListener = <T>(collectionPath: string): [null | FirestoreDoc<T>[], ErrorTypes] => {

    const [docs, setDocs] = useState<null | FirestoreDoc<T>[]>(null)
    const [error, setError] = useState<ErrorTypes>(null)

    useEffect(() => {

        const collectionRef = collection(firestore, collectionPath)
        let listener = onSnapshot(collectionRef, (querySnapshot) => {
            let documentsFetched: FirestoreDoc<T>[] = []

            querySnapshot.forEach((docRef) => {
                let doc: FirestoreDoc<T>;
                let data = docRef.data();
                data.id = docRef.id;
                doc = data as FirestoreDoc<T>;
                documentsFetched.push(doc)
            })
            setDocs(documentsFetched)
            setError(null)
        }, (e) => {
            console.error(e)
            setDocs(null)
            setError(e)
        })
        return (() => {
            listener();
        })
    }, [collectionPath])

    return [docs, error];
}

/**
 * Fetches documents from firestore (get()) using collection query
 */
export const useFirestoreQueryFetch = <T>(firestoreQuery: Query): [null | FirestoreDoc<T>[], ErrorTypes, boolean] => {

    const [docs, setDocs] = useState<null | FirestoreDoc<T>[]>(null)
    const [error, setError] = useState<ErrorTypes>(null)
    const [loading, setLoading] = useState(true)

    const queryCached = useMemoCompare(firestoreQuery, (prevQuery: Query) => {
        // Use built-in Firestore isEqual method to determine if "equal"
        return prevQuery && firestoreQuery && queryEqual(firestoreQuery, prevQuery)
    });

    useEffect(() => {

        setLoading(true)
        getDocs(firestoreQuery)
            .then((querySnapshot) => {

                let documentsFetched: FirestoreDoc<T>[] = []
                querySnapshot.forEach((docRef) => {
                    let doc: FirestoreDoc<T>;
                    let data = docRef.data();
                    data.id = docRef.id;
                    doc = data as FirestoreDoc<T>;
                    documentsFetched.push(doc)
                })
                setDocs(documentsFetched)
                setError(null)
            })
            .catch((error) => {
                console.error(error)
                setDocs(null)
                setError(error)
            })
            .finally(() => setLoading(false))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryCached])

    return [docs, error, loading];
}

// /**
//  * Listens to documents from firestore (onSnapshot()) using collection query
//  */
export const useFirestoreQueryListener = <T>(firestoreQuery: Query): [null | FirestoreDoc<T>[], ErrorTypes, boolean] => {

    const [docs, setDocs] = useState<null | FirestoreDoc<T>[]>(null)
    const [error, setError] = useState<ErrorTypes>(null)

    const queryCached = useMemoCompare(firestoreQuery, (prevQuery: Query) => {
        // Use built-in Firestore isEqual method to determine if "equal"
        return prevQuery && firestoreQuery && queryEqual(firestoreQuery, prevQuery)
    });


    useEffect(() => {

        let listener = onSnapshot(firestoreQuery, (querySnapshot) => {

            let documentsFetched: FirestoreDoc<T>[] = []

            querySnapshot.forEach((docRef) => {
                let doc: FirestoreDoc<T>;
                let data = docRef.data();
                data.id = docRef.id;
                doc = data as FirestoreDoc<T>;
                documentsFetched.push(doc)
            })
            setDocs(documentsFetched)
            setError(null)
        }, (error) => {
            console.error(error)
            setDocs(null)
            setError(error)
        })
        return (() => {
            listener();
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryCached])

    return [docs, error, docs === null && error === null];
}


// Hook
const useMemoCompare = (next: any, compare: (a: any, b: any) => boolean) => {
    // Ref for storing previous value
    const previousRef = useRef();
    const previous = previousRef.current;

    // Pass previous and next value to compare function
    // to determine whether to consider them equal.
    const isEqual = compare(previous, next);

    // If not equal update previousRef to next value.
    // We only update if not equal so that this hook continues to return
    // the same old value if compare keeps returning true.
    useEffect(() => {
        if (!isEqual) {
            previousRef.current = next;
        }
    });

    // Finally, if equal then return the previous value
    return isEqual ? previous : next;
}

/**
 * Deletes document from firestore using doc path
 * @returns [ startDocDelete, isLoading, isCompleted, error, reset ]
 */
export const useFirestoreDocDelete = (): [(docPath: string) => Promise<void>, boolean, boolean, ErrorTypes, () => void] => {

    const [isLoading, setLoading] = useState<boolean>(false)
    const [isCompleted, setCompleted] = useState<boolean>(false)
    const [error, setError] = useState<ErrorTypes>(null)


    const startDocDelete = (docPath: string): Promise<void> => {

        setLoading(true)
        let promise = new Promise<void>((resolve, reject) => {

            deleteDoc(doc(firestore, docPath))
                .then(() => {
                    setCompleted(true)
                    setError(null)
                    resolve()
                })
                .catch((error) => {
                    console.error(error)
                    setError(error)
                    reject(error)
                    setCompleted(false)
                })
                .finally(() => setLoading(false))
        })

        return promise
    }

    const reset = useCallback(() => {
        setLoading(false)
        setCompleted(false)
        setError(null)
    }, [])

    return [startDocDelete, isLoading, isCompleted, error, reset]
}

/**
 * Create document in firestore using collection path
 * @returns [ startDocUpload, isLoading, isCompleted, error, reset]
 */
export const useFirestoreDocCreate = (): [(collectionPath: string, data: any) => Promise<string>, boolean, boolean, ErrorTypes, () => void] => {

    const user = useContext(UserContext)
    const [isLoading, setLoading] = useState<boolean>(false)
    const [isCompleted, setCompleted] = useState<boolean>(false)
    const [error, setError] = useState<ErrorTypes>(null)

    const startDocUpload = (collectionPath: string, data: any): Promise<string> => {

        let createdBy: null | UserLog = null
        if (user != null) {
            createdBy = {
                id: user.uid,
                name: user.displayName,
                email: user.email
            }
        }

        setLoading(true)
        let promise = new Promise<string>((resolve, reject) => {

            let docRef = collection(firestore, collectionPath)
            addDoc(docRef, {
                createdOn: Timestamp.now(),
                lastUpdatedOn: Timestamp.now(),
                createdBy,
                lastUpdatedBy: createdBy,
                ...data
            })
                .then((docRef) => {
                    setCompleted(true)
                    setLoading(false)
                    setError(null)
                    resolve(docRef.id)
                })
                .catch((error) => {
                    console.error(error)
                    setError(error)
                    reject(error)
                    setLoading(false)
                    setCompleted(false)
                })
        })

        return promise
    }

    const reset = useCallback(() => {
        setLoading(false)
        setCompleted(false)
        setError(null)
    }, [])

    return [startDocUpload, isLoading, isCompleted, error, reset]
}

/**
 * Create document in firestore using collection path
 * @returns [ startDocUpload, isLoading, isCompleted, error, reset]
 */
export const useFirestoreDocSet = (): [(docPath: string, data: any, options?: SetOptions) => Promise<string>, boolean, boolean, ErrorTypes, () => void] => {

    const user = useContext(UserContext)
    const [isLoading, setLoading] = useState<boolean>(false)
    const [isCompleted, setCompleted] = useState<boolean>(false)
    const [error, setError] = useState<ErrorTypes>(null)

    const startDocUpload = (docPath: string, data: any, options?: SetOptions): Promise<string> => {

        let createdBy: null | UserLog = null
        if (user != null) {
            createdBy = {
                id: user.uid,
                name: user.displayName,
                email: user.email
            }
        }

        setLoading(true)
        let promise = new Promise<string>((resolve, reject) => {

            let docRef = doc(firestore, docPath)
            setDoc(docRef, {
                createdOn: Timestamp.now(),
                lastUpdatedOn: Timestamp.now(),
                createdBy,
                lastUpdatedBy: createdBy,
                ...data
            }, options ?? {})
                .then((docRef) => {
                    setCompleted(true)
                    setLoading(false)
                    setError(null)
                    resolve("")
                })
                .catch((error) => {
                    console.error(error)
                    setError(error)
                    reject(error)
                    setLoading(false)
                    setCompleted(false)
                })
        })

        return promise
    }

    const reset = useCallback(() => {
        setLoading(false)
        setCompleted(false)
        setError(null)
    }, [])

    return [startDocUpload, isLoading, isCompleted, error, reset]
}

/**
 * Updates document in firestore using doc path
 * @returns [ startDocUpdate, isLoading, isCompleted, error, reset]
 */
export const useFirestoreDocEdit = (): [(docPath: string, data: any) => Promise<void>, boolean, boolean, ErrorTypes, () => void] => {

    const user = useContext(UserContext)
    const [isLoading, setLoading] = useState<boolean>(false)
    const [isCompleted, setCompleted] = useState<boolean>(false)
    const [error, setError] = useState<ErrorTypes>(null)

    const startDocUpdate = (docPath: string, data: any): Promise<void> => {

        let lastUpdatedBy: null | UserLog = null
        if (user != null) {
            lastUpdatedBy = {
                id: user.uid,
                name: user.displayName,
                email: user.email
            }
        }

        setLoading(true)
        setCompleted(false)

        let promise = new Promise<void>((resolve, reject) => {

            let docRef = doc(firestore, docPath)
            updateDoc(docRef, {
                lastUpdatedOn: Timestamp.now(),
                lastUpdatedBy,
                ...data
            })
                .then(() => {
                    setCompleted(true)
                    setError(null)
                    resolve()
                })
                .catch((error) => {
                    console.error(error)
                    setError(error)
                    reject(error)
                    setCompleted(false)
                })
                .finally(() => setLoading(false))
        })

        return promise
    }

    const reset = useCallback(() => {
        setLoading(false)
        setCompleted(false)
        setError(null)
    }, [])

    return [startDocUpdate, isLoading, isCompleted, error, reset]
}